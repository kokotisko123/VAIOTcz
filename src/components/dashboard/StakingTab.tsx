
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Award, Calendar, Clock, Check, Lock, TrendingUp, ArrowRight, Info, AlertCircle, ArrowUpRight, ChartBar } from "lucide-react";
import { motion } from "framer-motion";
import { format, addDays, differenceInDays, isAfter } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RewardsTab } from "@/components/dashboard/RewardsTab";

type StakingStatus = "locked" | "unlockable" | "unstaked";

interface StakingInfo {
  id: string;
  amount: number;
  period: number;
  startDate: Date;
  unlockDate: Date;
  apy: number;
  projectedReward: number;
  status: StakingStatus;
}

interface DbStake {
  id: string;
  user_id: string;
  amount: number;
  period: number;
  start_date: string;
  unlock_date: string;
  apy: number;
  projected_reward: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface StakingTabProps {
  investments: {
    ethAmount: number;
    eurValue: number;
    timestamp: string;
    projectedValue?: number;
  }[];
  totalInvested: number;
  totalProjectedValue: number;
}

const StakingTab: React.FC<StakingTabProps> = ({ investments, totalInvested, totalProjectedValue }) => {
  const [stakingPeriod, setStakingPeriod] = useState<number>(30);
  const [stakingAmount, setStakingAmount] = useState<string>("");
  const [apy, setApy] = useState<number>(1.3);
  const [projectedReward, setProjectedReward] = useState<number>(0);
  const [stakedTokens, setStakedTokens] = useState<StakingInfo[]>([]);
  const [availableBalance, setAvailableBalance] = useState<number>(totalInvested);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    if (stakingPeriod === 30) {
      setApy(1.3);
    } else if (stakingPeriod === 90) {
      setApy(4.0);
    } else if (stakingPeriod === 365) {
      setApy(17.6);
    }
  }, [stakingPeriod]);
  
  useEffect(() => {
    if (stakingAmount && parseFloat(stakingAmount) > 0) {
      const amount = parseFloat(stakingAmount);
      const yearFraction = stakingPeriod / 365;
      const reward = amount * (apy / 100) * yearFraction;
      setProjectedReward(parseFloat(reward.toFixed(2)));
    } else {
      setProjectedReward(0);
    }
  }, [stakingAmount, stakingPeriod, apy]);
  
  // Load stakes from Supabase
  useEffect(() => {
    const fetchStakes = async () => {
      if (!user) return;
      
      setLoading(true);
      
      try {
        const { data: stakesData, error } = await supabase
          .from("stakes")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        
        if (error) {
          console.error("Error fetching stakes:", error);
          toast({
            title: "Error",
            description: "Failed to load your staking information",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        if (stakesData) {
          const formattedStakes: StakingInfo[] = stakesData.map((stake: DbStake) => ({
            id: stake.id,
            amount: Number(stake.amount),
            period: stake.period,
            startDate: new Date(stake.start_date),
            unlockDate: new Date(stake.unlock_date),
            apy: Number(stake.apy),
            projectedReward: Number(stake.projected_reward),
            status: stake.status as StakingStatus,
          }));
          
          setStakedTokens(formattedStakes);
          updateStakeStatuses(formattedStakes);
        }
      } catch (error) {
        console.error("Error in fetch stakes:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStakes();
  }, [user, toast]);
  
  useEffect(() => {
    if (user) {
      const totalStaked = stakedTokens.reduce((sum, stake) => 
        stake.status !== "unstaked" ? sum + stake.amount : sum, 0);
      setAvailableBalance(totalInvested - totalStaked);
    }
  }, [totalInvested, stakedTokens, user]);
  
  const updateStakeStatuses = async (stakes: StakingInfo[]) => {
    if (!user) return;
    
    const now = new Date();
    const stakesToUpdate: string[] = [];
    
    const updatedStakes = stakes.map(stake => {
      let updatedStatus: StakingStatus = stake.status;
      
      // If stake is locked and unlock date has passed, mark as unlockable
      if (stake.status === "locked" && isAfter(now, stake.unlockDate)) {
        updatedStatus = "unlockable";
        stakesToUpdate.push(stake.id);
      }
      
      return {
        ...stake,
        status: updatedStatus
      };
    });
    
    // Update statuses in Supabase
    for (const stakeId of stakesToUpdate) {
      try {
        const { error } = await supabase
          .from("stakes")
          .update({ status: "unlockable" })
          .eq("id", stakeId);
        
        if (error) {
          console.error("Error updating stake status:", error);
        }
      } catch (error) {
        console.error("Error updating stake status:", error);
      }
    }
    
    if (stakesToUpdate.length > 0) {
      setStakedTokens(updatedStakes);
    }
  };
  
  const handleStake = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to stake tokens.",
        variant: "destructive"
      });
      return;
    }
    
    const amount = parseFloat(stakingAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid stake amount.",
        variant: "destructive"
      });
      return;
    }
    
    if (amount > availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance to stake this amount.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const startDate = new Date();
      const unlockDate = addDays(startDate, stakingPeriod);
      
      // Insert stake into Supabase
      const { data: stakeData, error } = await supabase
        .from("stakes")
        .insert({
          user_id: user.id,
          amount: amount,
          period: stakingPeriod,
          apy: apy,
          start_date: startDate.toISOString(),
          unlock_date: unlockDate.toISOString(),
          projected_reward: projectedReward,
          status: "locked"
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Add the new stake to the local state
      if (stakeData) {
        const newStake: StakingInfo = {
          id: stakeData.id,
          amount: Number(stakeData.amount),
          period: stakeData.period,
          startDate: new Date(stakeData.start_date),
          unlockDate: new Date(stakeData.unlock_date),
          apy: Number(stakeData.apy),
          projectedReward: Number(stakeData.projected_reward),
          status: stakeData.status as StakingStatus
        };
        
        setStakedTokens(prev => [newStake, ...prev]);
      }
      
      setStakingAmount("");
      
      toast({
        title: "Staking Successful",
        description: `You have successfully staked ${amount} EUR for ${stakingPeriod} days.`,
        variant: "default"
      });
    } catch (error) {
      console.error("Error staking tokens:", error);
      toast({
        title: "Staking Failed",
        description: "There was an error processing your staking request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleUnstake = async (stakeId: string) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Update stake in Supabase
      const { error } = await supabase
        .from("stakes")
        .update({ status: "unstaked" })
        .eq("id", stakeId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      const updatedStakes = stakedTokens.map(stake => 
        stake.id === stakeId ? { ...stake, status: "unstaked" as StakingStatus } : stake
      );
      
      setStakedTokens(updatedStakes);
      
      toast({
        title: "Unstaking Successful",
        description: "Your tokens have been unstaked successfully. They will be available in your balance shortly.",
        variant: "default"
      });
    } catch (error) {
      console.error("Error unstaking tokens:", error);
      toast({
        title: "Unstaking Failed",
        description: "There was an error processing your unstaking request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const calculateTimeLeft = (unlockDate: Date) => {
    const now = new Date();
    const daysLeft = Math.max(0, differenceInDays(unlockDate, now));
    return daysLeft;
  };

  return (
    <Tabs defaultValue="stake" className="space-y-6">
      <TabsList className="bg-white shadow-sm p-1 rounded-lg border mb-6">
        <TabsTrigger value="stake" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
          <Lock className="h-4 w-4 mr-2" />
          Stake Tokens
        </TabsTrigger>
        <TabsTrigger value="rewards" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
          <ChartBar className="h-4 w-4 mr-2" />
          Rewards
        </TabsTrigger>
      </TabsList>

      <TabsContent value="stake">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white shadow-md border-none overflow-hidden">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="flex items-center text-lg">
                <Award className="mr-2 h-5 w-5 text-blue-600" />
                Stake Your Tokens
              </CardTitle>
              <CardDescription>Earn passive income with flexible staking options</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="staking-amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount to Stake (EUR)
                  </label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="staking-amount"
                      type="number"
                      min="0"
                      step="1"
                      value={stakingAmount}
                      onChange={(e) => setStakingAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="flex-1"
                      disabled={loading}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setStakingAmount(availableBalance.toString())}
                      disabled={availableBalance <= 0 || loading}
                    >
                      Max
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Available balance: €{availableBalance.toFixed(2)}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Staking Period
                  </label>
                  <div className="flex space-x-2">
                    {[
                      { days: 30, apy: 1.3 },
                      { days: 90, apy: 4.0 },
                      { days: 365, apy: 17.6 }
                    ].map(option => (
                      <button
                        key={option.days}
                        onClick={() => setStakingPeriod(option.days)}
                        className={`flex-1 py-3 px-2 rounded-lg border transition-colors ${
                          stakingPeriod === option.days
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                        }`}
                        disabled={loading}
                      >
                        <div className="font-medium">{option.days} Days</div>
                        <div className={`text-sm ${stakingPeriod === option.days ? 'text-blue-100' : 'text-gray-500'}`}>
                          {option.apy}% APY
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-1 text-blue-600" />
                    Staking Summary
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-600">Amount:</div>
                    <div className="font-medium text-right">€{stakingAmount || '0'}</div>
                    
                    <div className="text-gray-600">Staking Period:</div>
                    <div className="font-medium text-right">{stakingPeriod} Days</div>
                    
                    <div className="text-gray-600">APY:</div>
                    <div className="font-medium text-right">{apy}%</div>
                    
                    <div className="text-gray-600">Projected Reward:</div>
                    <div className="font-medium text-right text-green-600">€{projectedReward.toFixed(2)}</div>
                    
                    <div className="text-gray-600">Unlock Date:</div>
                    <div className="font-medium text-right">
                      {format(addDays(new Date(), stakingPeriod), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleStake}
                  disabled={
                    loading ||
                    !stakingAmount || 
                    parseFloat(stakingAmount) <= 0 || 
                    parseFloat(stakingAmount) > availableBalance
                  }
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Stake Now
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md border-none overflow-hidden">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                Staking Benefits
              </CardTitle>
              <CardDescription>Why stake your VAIOT tokens</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Earn Passive Income</h4>
                    <p className="text-sm text-gray-600 mt-1">Earn up to 17.6% APY on your VAIOT tokens without active trading.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 bg-green-100 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Flexible Staking Periods</h4>
                    <p className="text-sm text-gray-600 mt-1">Choose from 30, 90, or 365-day staking periods to suit your investment strategy.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 bg-purple-100 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Automatic Rewards</h4>
                    <p className="text-sm text-gray-600 mt-1">Rewards are calculated and compounded automatically for optimal returns.</p>
                  </div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-5 text-white mt-6"
                >
                  <h4 className="font-medium flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Boost Your Returns
                  </h4>
                  <p className="mt-2 text-sm text-blue-100">
                    The longer your staking period, the higher your APY. Lock your tokens for 365 days to maximize your earnings with our highest APY rate of 17.6%.
                  </p>
                  <div className="mt-4 pt-3 border-t border-blue-500">
                    <div className="flex justify-between text-sm">
                      <span>30 Days</span>
                      <span>90 Days</span>
                      <span>365 Days</span>
                    </div>
                    <div className="w-full bg-blue-700 rounded-full h-2 mt-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full"
                        style={{ width: `${(apy / 17.6) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>1.3%</span>
                      <span>4.0%</span>
                      <span>17.6%</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-white shadow-md border-none overflow-hidden mt-6">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="flex items-center text-lg">
              <Check className="mr-2 h-5 w-5 text-green-600" />
              Your Staked Tokens
            </CardTitle>
            <CardDescription>View and manage your staked VAIOT tokens</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : stakedTokens.length > 0 ? (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Amount</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Period</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Start Date</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Unlock Date</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">APY</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Status</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {stakedTokens.map((stake) => (
                        <tr key={stake.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-medium">€{stake.amount.toFixed(2)}</td>
                          <td className="py-3 px-4 text-sm">{stake.period} Days</td>
                          <td className="py-3 px-4 text-sm">{format(stake.startDate, 'MMM d, yyyy')}</td>
                          <td className="py-3 px-4 text-sm">{format(stake.unlockDate, 'MMM d, yyyy')}</td>
                          <td className="py-3 px-4 text-sm">{stake.apy}%</td>
                          <td className="py-3 px-4 text-sm">
                            {stake.status === "locked" && (
                              <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                <Lock className="h-3 w-3 mr-1" />
                                Locked ({calculateTimeLeft(stake.unlockDate)} days left)
                              </span>
                            )}
                            {stake.status === "unlockable" && (
                              <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                <Check className="h-3 w-3 mr-1" />
                                Ready to Unstake
                              </span>
                            )}
                            {stake.status === "unstaked" && (
                              <span className="inline-flex items-center bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                <Check className="h-3 w-3 mr-1" />
                                Unstaked
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {stake.status === "unlockable" && (
                              <Button 
                                size="sm"
                                onClick={() => handleUnstake(stake.id)}
                                className="bg-green-600 hover:bg-green-700"
                                disabled={loading}
                              >
                                Unstake
                              </Button>
                            )}
                            {stake.status === "locked" && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                disabled
                              >
                                Locked
                              </Button>
                            )}
                            {stake.status === "unstaked" && (
                              <span className="text-gray-500 text-xs">Completed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-1 text-blue-600" />
                    Staking Rewards Summary
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded border border-blue-100">
                      <div className="text-gray-600">Total Staked</div>
                      <div className="font-medium text-xl">€{stakedTokens
                        .filter(stake => stake.status !== "unstaked")
                        .reduce((sum, stake) => sum + stake.amount, 0).toFixed(2)}</div>
                    </div>
                    <div className="bg-white p-3 rounded border border-blue-100">
                      <div className="text-gray-600">Projected Rewards</div>
                      <div className="font-medium text-xl text-green-600">
                        €{stakedTokens
                           .filter(stake => stake.status !== "unstaked")
                           .reduce((sum, stake) => sum + stake.projectedReward, 0).toFixed(2)}
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded border border-blue-100">
                      <div className="text-gray-600">Active Stakes</div>
                      <div className="font-medium text-xl">
                        {stakedTokens.filter(stake => stake.status !== "unstaked").length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <Award className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h4 className="text-lg font-medium text-gray-600 mb-1">No staked tokens yet</h4>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  Start staking your VAIOT tokens to earn passive income with competitive APY rates.
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Start Staking Now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-md border-none overflow-hidden mt-6">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="flex items-center text-lg">
              <AlertCircle className="mr-2 h-5 w-5 text-amber-600" />
              Important Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4 text-sm text-gray-600">
              <p>• Staking rewards are calculated based on the amount staked and the staking period.</p>
              <p>• Tokens cannot be unstaked before the unlock date.</p>
              <p>• After the unlock date, you can choose to unstake your tokens or leave them staked to continue earning rewards.</p>
              <p>• Reward rates (APY) are subject to periodic reviews and may be adjusted.</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="rewards">
        <RewardsTab stakedTokens={stakedTokens} loading={loading} />
      </TabsContent>
    </Tabs>
  );
};

export default StakingTab;
