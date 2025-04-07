import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Award, Calendar, Clock, Check, Lock, TrendingUp, ArrowRight, Info, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { format, addDays, differenceInDays, isAfter } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

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
  
  useEffect(() => {
    if (!user) return;
    
    const storedStakes = localStorage.getItem(`vaiot_stakes_${user.id}`);
    if (storedStakes) {
      try {
        const parsedStakes = JSON.parse(storedStakes);
        
        const formattedStakes = parsedStakes.map((stake: any) => ({
          ...stake,
          startDate: new Date(stake.startDate),
          unlockDate: new Date(stake.unlockDate),
          status: stake.status as StakingStatus
        }));
        
        setStakedTokens(formattedStakes);
        
        updateStakeStatuses(formattedStakes);
      } catch (e) {
        console.error("Error parsing staked tokens:", e);
      }
    }
  }, [user]);
  
  useEffect(() => {
    if (user) {
      const totalStaked = stakedTokens.reduce((sum, stake) => sum + stake.amount, 0);
      setAvailableBalance(totalInvested - totalStaked);
    }
  }, [totalInvested, stakedTokens, user]);
  
  const updateStakeStatuses = (stakes: StakingInfo[]) => {
    if (!user) return;
    
    const now = new Date();
    const updatedStakes = stakes.map(stake => {
      let updatedStatus: StakingStatus = stake.status;
      
      if (stake.status !== "unstaked" && isAfter(now, stake.unlockDate)) {
        updatedStatus = "unlockable";
      }
      
      return {
        ...stake,
        status: updatedStatus
      };
    });
    
    if (JSON.stringify(updatedStakes) !== JSON.stringify(stakes)) {
      setStakedTokens(updatedStakes);
      localStorage.setItem(`vaiot_stakes_${user.id}`, JSON.stringify(updatedStakes));
    }
  };
  
  const handleStake = () => {
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
    
    const startDate = new Date();
    const unlockDate = addDays(startDate, stakingPeriod);
    
    const newStake: StakingInfo = {
      id: Math.random().toString(36).substring(2, 15),
      amount,
      period: stakingPeriod,
      startDate,
      unlockDate,
      apy,
      projectedReward,
      status: "locked" as StakingStatus
    };
    
    const updatedStakes = [...stakedTokens, newStake];
    setStakedTokens(updatedStakes);
    localStorage.setItem(`vaiot_stakes_${user.id}`, JSON.stringify(updatedStakes));
    
    setStakingAmount("");
    
    toast({
      title: "Staking Successful",
      description: `You have successfully staked ${amount} EUR for ${stakingPeriod} days.`,
      variant: "default"
    });
  };
  
  const handleUnstake = (stakeId: string) => {
    if (!user) return;
    
    const updatedStakes = stakedTokens.map(stake => 
      stake.id === stakeId ? { ...stake, status: "unstaked" as StakingStatus } : stake
    );
    
    setStakedTokens(updatedStakes);
    localStorage.setItem(`vaiot_stakes_${user.id}`, JSON.stringify(updatedStakes));
    
    toast({
      title: "Unstaking Successful",
      description: "Your tokens have been unstaked successfully. They will be available in your balance shortly.",
      variant: "default"
    });
  };
  
  const calculateTimeLeft = (unlockDate: Date) => {
    const now = new Date();
    const daysLeft = Math.max(0, differenceInDays(unlockDate, now));
    return daysLeft;
  };

  return (
    <div className="space-y-6">
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
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setStakingAmount(availableBalance.toString())}
                    disabled={availableBalance <= 0}
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
                  !stakingAmount || 
                  parseFloat(stakingAmount) <= 0 || 
                  parseFloat(stakingAmount) > availableBalance
                }
              >
                <Lock className="mr-2 h-4 w-4" />
                Stake Now
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
      
      <Card className="bg-white shadow-md border-none overflow-hidden">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="flex items-center text-lg">
            <Check className="mr-2 h-5 w-5 text-green-600" />
            Your Staked Tokens
          </CardTitle>
          <CardDescription>View and manage your staked VAIOT tokens</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {stakedTokens.length > 0 ? (
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
                    <div className="font-medium text-xl">€{stakedTokens.reduce((sum, stake) => sum + stake.amount, 0).toFixed(2)}</div>
                  </div>
                  <div className="bg-white p-3 rounded border border-blue-100">
                    <div className="text-gray-600">Projected Rewards</div>
                    <div className="font-medium text-xl text-green-600">
                      €{stakedTokens.reduce((sum, stake) => sum + stake.projectedReward, 0).toFixed(2)}
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
      
      <Card className="bg-white shadow-md border-none overflow-hidden">
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
    </div>
  );
};

export default StakingTab;
