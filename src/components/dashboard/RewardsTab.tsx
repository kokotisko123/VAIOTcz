
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format, differenceInDays, addDays } from "date-fns";
import { ArrowUpRight, Award, Calendar, TrendingUp, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

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

interface RewardsTabProps {
  stakedTokens: StakingInfo[];
  loading: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const RewardsTab: React.FC<RewardsTabProps> = ({ stakedTokens, loading }) => {
  // Calculate current rewards progress
  const calculateCurrentReward = (stake: StakingInfo): number => {
    const now = new Date();
    const startDate = new Date(stake.startDate);
    const unlockDate = new Date(stake.unlockDate);
    const totalDays = differenceInDays(unlockDate, startDate);
    const daysPassed = differenceInDays(now, startDate);
    
    // Calculate what percentage of the total staking period has passed
    const progressRatio = Math.min(Math.max(daysPassed / totalDays, 0), 1);
    
    // Calculate current reward based on progress ratio
    const currentReward = stake.projectedReward * progressRatio;
    return parseFloat(currentReward.toFixed(2));
  };

  // Generate data for rewards by period chart
  const rewardsByPeriod = [
    { period: "30 Days", totalStaked: 0, projectedRewards: 0 },
    { period: "90 Days", totalStaked: 0, projectedRewards: 0 },
    { period: "365 Days", totalStaked: 0, projectedRewards: 0 }
  ];
  
  // Generate data for rewards by status
  const rewardsByStatus = [
    { name: "Earning", value: 0 },
    { name: "Ready to Claim", value: 0 },
    { name: "Claimed", value: 0 }
  ];
  
  // Calculate reward data
  stakedTokens.forEach(stake => {
    // Add to rewards by period chart
    if (stake.period === 30) {
      rewardsByPeriod[0].totalStaked += stake.amount;
      rewardsByPeriod[0].projectedRewards += stake.projectedReward;
    } else if (stake.period === 90) {
      rewardsByPeriod[1].totalStaked += stake.amount;
      rewardsByPeriod[1].projectedRewards += stake.projectedReward;
    } else if (stake.period === 365) {
      rewardsByPeriod[2].totalStaked += stake.amount;
      rewardsByPeriod[2].projectedRewards += stake.projectedReward;
    }
    
    // Add to rewards by status chart
    const currentReward = calculateCurrentReward(stake);
    
    if (stake.status === "locked") {
      rewardsByStatus[0].value += currentReward;
    } else if (stake.status === "unlockable") {
      rewardsByStatus[1].value += stake.projectedReward;
    } else if (stake.status === "unstaked") {
      rewardsByStatus[2].value += stake.projectedReward;
    }
  });
  
  // Format the pie chart values
  rewardsByStatus.forEach(item => {
    item.value = parseFloat(item.value.toFixed(2));
  });
  
  // Calculate monthly reward projections
  const generateMonthlyProjections = () => {
    const projections = [];
    const now = new Date();
    
    // Generate data for the next 6 months
    for (let i = 0; i < 6; i++) {
      const month = addDays(now, i * 30);
      let monthlyReward = 0;
      
      stakedTokens.forEach(stake => {
        if (stake.status !== "unstaked") {
          const stakeEnd = new Date(stake.unlockDate);
          
          // If the stake is still active in this month
          if (month <= stakeEnd) {
            // Calculate monthly reward (approximated)
            const monthlyRate = stake.apy / 12 / 100;
            monthlyReward += stake.amount * monthlyRate;
          }
        }
      });
      
      projections.push({
        month: format(month, 'MMM yyyy'),
        reward: parseFloat(monthlyReward.toFixed(2))
      });
    }
    
    return projections;
  };
  
  const monthlyProjections = generateMonthlyProjections();
  
  // Calculate totals
  const totalEarned = rewardsByStatus[2].value;
  const readyToClaim = rewardsByStatus[1].value;
  const currentlyEarning = rewardsByStatus[0].value;
  const totalProjected = stakedTokens.reduce((sum, stake) => 
    stake.status !== "unstaked" ? sum + stake.projectedReward : sum, 0);

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md p-5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Earned</p>
                  <h3 className="text-2xl font-bold">€{totalEarned.toFixed(2)}</h3>
                </div>
                <div className="bg-green-100 p-2 rounded-full">
                  <Wallet className="h-5 w-5 text-green-700" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Completed staking rewards</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white rounded-xl shadow-md p-5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Ready to Claim</p>
                  <h3 className="text-2xl font-bold">€{readyToClaim.toFixed(2)}</h3>
                </div>
                <div className="bg-blue-100 p-2 rounded-full">
                  <Award className="h-5 w-5 text-blue-700" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Unlocked rewards ready to claim</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white rounded-xl shadow-md p-5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Currently Earning</p>
                  <h3 className="text-2xl font-bold">€{currentlyEarning.toFixed(2)}</h3>
                </div>
                <div className="bg-amber-100 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-amber-700" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Current rewards being generated</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white rounded-xl shadow-md p-5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Projected</p>
                  <h3 className="text-2xl font-bold">€{totalProjected.toFixed(2)}</h3>
                </div>
                <div className="bg-purple-100 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-purple-700" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Expected rewards at maturity</p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white shadow-md border-none overflow-hidden">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg">Monthly Reward Projections</CardTitle>
                <CardDescription>Estimated rewards for the next 6 months</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {stakedTokens.length > 0 ? (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={monthlyProjections}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `€${value}`} />
                        <Bar dataKey="reward" fill="#3b82f6" name="Monthly Reward" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-72 bg-gray-50 rounded-md">
                    <p className="text-gray-500">No staking data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md border-none overflow-hidden">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg">Rewards Distribution</CardTitle>
                <CardDescription>Breakdown of your staking rewards</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {stakedTokens.length > 0 ? (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={rewardsByStatus.filter(item => item.value > 0)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {rewardsByStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `€${value}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-72 bg-gray-50 rounded-md">
                    <p className="text-gray-500">No staking data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white shadow-md border-none overflow-hidden">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg">Rewards by Staking Period</CardTitle>
              <CardDescription>Compare returns across different staking periods</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {stakedTokens.length > 0 ? (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={rewardsByPeriod.filter(item => item.totalStaked > 0)}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip formatter={(value) => `€${value}`} />
                      <Bar dataKey="totalStaked" name="Amount Staked" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="projectedRewards" name="Projected Rewards" fill="#34d399" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-72 bg-gray-50 rounded-md">
                  <p className="text-gray-500">No staking data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md border-none overflow-hidden">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg">Reward History</CardTitle>
              <CardDescription>Complete history of your staking rewards</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {stakedTokens.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Period</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Amount Staked</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Start Date</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Unlock Date</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">APY</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Reward</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {stakedTokens.map((stake) => {
                        const currentReward = calculateCurrentReward(stake);
                        return (
                          <tr key={stake.id} className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm">{stake.period} Days</td>
                            <td className="py-3 px-4 text-sm font-medium">€{stake.amount.toFixed(2)}</td>
                            <td className="py-3 px-4 text-sm">{format(stake.startDate, 'MMM d, yyyy')}</td>
                            <td className="py-3 px-4 text-sm">{format(stake.unlockDate, 'MMM d, yyyy')}</td>
                            <td className="py-3 px-4 text-sm">{stake.apy}%</td>
                            <td className="py-3 px-4 text-sm">
                              <div className="flex items-center">
                                <span className="font-medium text-green-700">
                                  €{stake.status === "locked" ? currentReward.toFixed(2) : stake.projectedReward.toFixed(2)}
                                </span>
                                {stake.status === "locked" && (
                                  <span className="ml-1 text-xs text-gray-500">
                                    of €{stake.projectedReward.toFixed(2)}
                                  </span>
                                )}
                              </div>
                              {stake.status === "locked" && (
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                  <div 
                                    className="bg-green-500 h-1.5 rounded-full" 
                                    style={{ width: `${Math.min((currentReward / stake.projectedReward) * 100, 100)}%` }}
                                  ></div>
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {stake.status === "locked" && (
                                <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                  Earning
                                </span>
                              )}
                              {stake.status === "unlockable" && (
                                <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                  Ready to Claim
                                </span>
                              )}
                              {stake.status === "unstaked" && (
                                <span className="inline-flex items-center bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                  Claimed
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <Award className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <h4 className="text-lg font-medium text-gray-600 mb-1">No rewards history yet</h4>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Start staking your VAIOT tokens to begin earning rewards.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
