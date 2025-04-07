import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import { 
  ArrowUpRight, Wallet, LineChart, PieChart as PieChartIcon, 
  Landmark, Bell, User as UserIcon, Settings, LogOut, 
  DollarSign, ArrowUpRightFromCircle, ShieldCheck, AlertTriangle,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCryptoPrices } from "@/hooks/useCryptoPrices";
import StakingTab from "@/components/dashboard/StakingTab";

interface Portfolio {
  id: string;
  name: string;
  description: string | null;
}

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface Investment {
  ethAmount: number;
  eurValue: number;
  timestamp: string;
  projectedValue?: number;
}

interface DbInvestment {
  id: string;
  user_id: string;
  eth_amount: number;
  eur_value: number;
  created_at: string;
  updated_at: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#4CAF50', '#FF5722'];

const Dashboard: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [totalInvested, setTotalInvested] = useState<number>(0);
  const [totalProjectedValue, setTotalProjectedValue] = useState<number>(0);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [allocationData, setAllocationData] = useState<any[]>([]);
  const [showFreezeWarning, setShowFreezeWarning] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { prices } = useCryptoPrices();
  
  const APR = 17.6;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'b') {
        setShowFreezeWarning(true);
        
        setTimeout(() => {
          setShowFreezeWarning(false);
        }, 8000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        navigate("/auth");
        return;
      }
      
      setSession(data.session);
      fetchUserData(data.session.user.id);
      loadUserInvestments(data.session.user.id);
    };
    
    fetchSession();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT") {
          navigate("/auth");
        } else if (session) {
          setSession(session);
          fetchUserData(session.user.id);
          loadUserInvestments(session.user.id);
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const fetchUserData = async (userId: string) => {
    setLoading(true);
    
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (!profileError && profileData) {
      setProfile(profileData as Profile);
    }
    
    const { data: portfolioData, error: portfolioError } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', userId);
      
    if (!portfolioError && portfolioData) {
      setPortfolios(portfolioData as Portfolio[]);
    }
    
    try {
      const { data: investmentsData, error: investmentsError } = await supabase
        .from('investments' as any)
        .select('*')
        .eq('user_id', userId);
      
      if (!investmentsError && investmentsData && investmentsData.length > 0) {
        const transformedInvestments = (investmentsData as unknown as DbInvestment[]).map(inv => ({
          ethAmount: Number(inv.eth_amount),
          eurValue: Number(inv.eur_value),
          timestamp: inv.created_at,
          projectedValue: calculateProjectedValue(Number(inv.eur_value), new Date(inv.created_at))
        }));
        
        setInvestments(transformedInvestments);
        processInvestmentData(transformedInvestments);
      } else {
        loadUserInvestments(userId);
      }
    } catch (error) {
      console.error("Error fetching investments:", error);
      loadUserInvestments(userId);
    }
    
    setLoading(false);
  };
  
  const calculateProjectedValue = (initialValue: number, investmentDate: Date): number => {
    const now = new Date();
    const yearFraction = (now.getTime() - investmentDate.getTime()) / (365 * 24 * 60 * 60 * 1000);
    const projectedValue = initialValue * Math.pow(1 + (APR/100), yearFraction);
    return parseFloat(projectedValue.toFixed(2));
  };

  const calculateCurrentEthValue = (ethAmount: number): number => {
    if (!prices || !prices.ethereum || !prices.ethereum.eur) {
      return ethAmount;
    }
    const currentEthValue = ethAmount * prices.ethereum.eur;
    return parseFloat(currentEthValue.toFixed(2));
  };

  const loadUserInvestments = (userId: string) => {
    const investmentsString = localStorage.getItem(`vaiot_investments_${userId}`);
    if (investmentsString) {
      try {
        const loadedInvestments: Investment[] = JSON.parse(investmentsString);
        
        const enrichedInvestments = loadedInvestments.map(investment => {
          const investmentDate = new Date(investment.timestamp);
          const projectedValue = calculateProjectedValue(investment.eurValue, investmentDate);
          
          return {
            ...investment,
            projectedValue
          };
        });
        
        setInvestments(enrichedInvestments);
        processInvestmentData(enrichedInvestments);
      } catch (e) {
        console.error("Error parsing investments:", e);
      }
    }
  };

  const processInvestmentData = useCallback((investmentData: Investment[]) => {
    const totalEur = investmentData.reduce((sum, inv) => sum + inv.eurValue, 0);
    const totalProjected = investmentData.reduce((sum, inv) => sum + (inv.projectedValue || inv.eurValue), 0);
    
    setTotalInvested(parseFloat(totalEur.toFixed(2)));
    setTotalProjectedValue(parseFloat(totalProjected.toFixed(2)));
    
    generateChartData(investmentData);
    generateAllocationData(investmentData);
  }, []);

  const generateChartData = (investmentData: Investment[]) => {
    const performance: any[] = [];
    
    const sortedInvestments = [...investmentData].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    if (sortedInvestments.length > 0) {
      const startDate = new Date(sortedInvestments[0].timestamp);
      const endDate = new Date();
      const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                        (endDate.getMonth() - startDate.getMonth());
      
      for (let i = 0; i <= monthDiff; i++) {
        const currentDate = new Date(startDate);
        currentDate.setMonth(currentDate.getMonth() + i);
        const dateString = currentDate.toISOString().split('T')[0];
        
        let investedAmount = 0;
        let projectedAmount = 0;
        
        sortedInvestments.forEach(inv => {
          if (new Date(inv.timestamp) <= currentDate) {
            investedAmount += inv.eurValue;
            
            const investmentDate = new Date(inv.timestamp);
            const yearFraction = (currentDate.getTime() - investmentDate.getTime()) / (365 * 24 * 60 * 60 * 1000);
            const projectedValue = inv.eurValue * Math.pow(1 + (APR/100), yearFraction);
            projectedAmount += projectedValue;
          }
        });
        
        performance.push({
          date: dateString,
          invested: parseFloat(investedAmount.toFixed(2)),
          projected: parseFloat(projectedAmount.toFixed(2))
        });
      }
    }
    
    setPerformanceData(performance);
  };

  const generateAllocationData = (investmentData: Investment[]) => {
    if (!investmentData.length) {
      setAllocationData([]);
      return;
    }
    
    const totalValue = investmentData.reduce((sum, inv) => sum + (inv.projectedValue || inv.eurValue), 0);
    
    const allocation = [
      { name: 'VAIOT Tokens', value: totalValue * 0.65 },
      { name: 'Staking Rewards', value: totalValue * 0.15 },
      { name: 'Growth Fund', value: totalValue * 0.12 },
      { name: 'Liquidity Pool', value: totalValue * 0.08 }
    ];
    
    setAllocationData(allocation);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const customTooltipFormatter = (value: any) => {
    if (typeof value === 'number') {
      return `€${value.toFixed(2)}`;
    }
    return `€${value}`;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {showFreezeWarning && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full">
            <div className="flex items-center mb-4">
              <AlertTriangle size={32} className="text-red-600 mr-3" />
              <h2 className="text-2xl font-bold text-red-600">CRITICAL WARNING</h2>
            </div>
            <hr className="border-red-200 mb-4" />
            <p className="text-gray-800 font-medium mb-4">
              Your funds have been frozen due to AML measures. We kindly request you to submit all necessary details for KYC verification.
            </p>
            <p className="text-gray-800 mb-6">
              If the provided information is false, we will take immediate precaution and lock away your funds permanently. 
              This is in accordance with our terms of service and regulatory requirements.
            </p>
            <div className="flex justify-end">
              <Button 
                variant="destructive"
                onClick={() => setShowFreezeWarning(false)}
              >
                I Understand
              </Button>
            </div>
          </div>
        </div>
      )}
    
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">VAIOT Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20">
                <Bell size={18} />
              </button>
              <div className="flex items-center bg-white/10 rounded-full px-3 py-1">
                <UserIcon size={18} className="mr-2" />
                <span className="font-medium">{profile?.full_name || "Investor"}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-white text-white hover:bg-white/20 hover:text-white"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Card className="overflow-hidden bg-white border-none shadow-xl">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-6 text-white">
              <h2 className="text-2xl font-bold mb-1">Investment Portfolio</h2>
              <p className="text-blue-100">Your VAIOT investment summary</p>
            </div>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl shadow-sm border border-blue-100">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-500">Total Invested</h3>
                    <DollarSign size={20} className="text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">€{totalInvested.toLocaleString()}</p>
                  <div className="mt-2 text-xs text-gray-500">Initial capital</div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-xl shadow-sm border border-green-100">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-500">Current Value</h3>
                    <ArrowUpRightFromCircle size={20} className="text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">€{totalProjectedValue.toLocaleString()}</p>
                  <div className="flex items-center mt-2 text-green-600 text-xs">
                    <ArrowUpRight size={14} className="mr-1" />
                    <span>{totalInvested > 0 ? ((totalProjectedValue / totalInvested - 1) * 100).toFixed(2) : "0.00"}% growth</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-5 rounded-xl shadow-sm border border-amber-100">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-500">Annual Yield</h3>
                    <ShieldCheck size={20} className="text-amber-600" />
                  </div>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold text-gray-900">{APR}% APR</p>
                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Guaranteed</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">Fixed rate returns</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="mb-6 bg-white shadow-sm p-1 rounded-lg border">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <LineChart className="h-4 w-4 mr-2" />
              Portfolio Overview
            </TabsTrigger>
            <TabsTrigger value="investments" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Wallet className="h-4 w-4 mr-2" />
              My Investments
            </TabsTrigger>
            <TabsTrigger value="allocation" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <PieChartIcon className="h-4 w-4 mr-2" />
              Asset Allocation
            </TabsTrigger>
            {investments.length > 0 && (
              <TabsTrigger value="staking" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Award className="h-4 w-4 mr-2" />
                Staking
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="bg-white shadow-md border-none overflow-hidden">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="flex items-center text-lg">
                    <LineChart className="mr-2 h-5 w-5 text-blue-600" />
                    Performance Over Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 h-80">
                  {performanceData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={performanceData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip 
                          formatter={customTooltipFormatter}
                          contentStyle={{ 
                            borderRadius: "8px", 
                            border: "none", 
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)" 
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="invested" 
                          stackId="1" 
                          stroke="#8884d8" 
                          fill="#8884d8" 
                          name="Invested"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="projected" 
                          stackId="2" 
                          stroke="#82ca9d" 
                          fill="#82ca9d"
                          name="Current Value"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-500">No investment data to display</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-md border-none overflow-hidden">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="flex items-center text-lg">
                    <PieChartIcon className="mr-2 h-5 w-5 text-purple-600" />
                    Asset Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 h-80">
                  {allocationData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={allocationData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {allocationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend layout="vertical" verticalAlign="middle" align="right" />
                        <Tooltip formatter={customTooltipFormatter} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-500">No allocation data to display</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-white shadow-md border-none overflow-hidden">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="flex items-center text-lg">
                  <Landmark className="mr-2 h-5 w-5 text-green-600" />
                  Investment Growth Projection
                </CardTitle>
                <CardDescription>
                  Based on {APR}% Annual Percentage Rate (APR)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 py-4">
                  {investments.length > 0 ? (
                    <div className="relative overflow-x-auto rounded-lg shadow-sm border">
                      <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Initial Investment</th>
                            <th scope="col" className="px-6 py-3">Current Value</th>
                            <th scope="col" className="px-6 py-3">Growth</th>
                          </tr>
                        </thead>
                        <tbody>
                          {investments.map((investment, i) => {
                            const growth = ((investment.projectedValue || investment.eurValue) / investment.eurValue - 1) * 100;
                            return (
                              <tr key={i} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">
                                  {new Date(investment.timestamp).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                  €{investment.eurValue.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 font-medium">
                                  €{(investment.projectedValue || investment.eurValue).toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                  <span className="flex items-center text-green-600 font-medium">
                                    {growth.toFixed(2)}% <ArrowUpRight className="ml-1 h-4 w-4" />
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr className="font-semibold text-gray-800 bg-gray-50">
                            <th scope="row" className="px-6 py-3 text-base">Totals</th>
                            <td className="px-6 py-3">€{totalInvested.toFixed(2)}</td>
                            <td className="px-6 py-3">€{totalProjectedValue.toFixed(2)}</td>
                            <td className="px-6 py-3">
                              <span className="flex items-center text-green-600 font-medium">
                                {totalInvested > 0 ? ((totalProjectedValue / totalInvested - 1) * 100).toFixed(2) : "0.00"}% <ArrowUpRight className="ml-1 h-4 w-4" />
                              </span>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-500 mb-3">No investments yet. Start investing in VAIOT to see your portfolio grow!</p>
                      <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/#how-it-works')}>
                        Start Investing
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="investments">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="bg-white shadow-md border-none overflow-hidden">
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle>Your VAIOT Investments</CardTitle>
                    <CardDescription>Track all your VAIOT token investments</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {investments.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 mb-3">You don't have any investments yet.</p>
                        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/#how-it-works')}>
                          Make Your First Investment
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {investments.map((investment, index) => {
                          const growth = ((investment.projectedValue || investment.eurValue) / investment.eurValue - 1) * 100;
                          return (
                            <div 
                              key={index} 
                              className={cn(
                                "p-5 rounded-lg border transition-all",
                                growth > 10 ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
                              )}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center">
                                    <p className="font-semibold text-lg">{investment.ethAmount} ETH</p>
                                    <span className="bg-blue-100 text-blue-800 text-xs ml-2 px-2 py-1 rounded">VAIOT</span>
                                  </div>
                                  <p className="text-sm text-gray-600">{new Date(investment.timestamp).toLocaleDateString()} • Initial: €{investment.eurValue.toFixed(2)}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-lg">€{(investment.projectedValue || investment.eurValue).toFixed(2)}</p>
                                  <div className="flex items-center justify-end text-green-600">
                                    <ArrowUpRight className="h-4 w-4 mr-1" />
                                    <span className="font-medium">{growth.toFixed(2)}%</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Projected APR: <span className="font-medium">{APR}%</span></span>
                                  <span className="text-gray-600">Value in 1 year: <span className="font-medium">€{(investment.eurValue * (1 + APR/100)).toFixed(2)}</span></span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card className="bg-white shadow-md border-none overflow-hidden">
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle>Portfolio Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Investments</span>
                        <span className="font-semibold">{investments.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount Invested</span>
                        <span className="font-semibold">€{totalInvested.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Portfolio Value</span>
                        <span className="font-semibold">€{totalProjectedValue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Growth (from investments)</span>
                        <span className="font-semibold text-green-600">
                          {totalInvested > 0 ? ((totalProjectedValue / totalInvested - 1) * 100).toFixed(2) : "0.00"}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Annual Yield (APR)</span>
                        <span className="font-semibold text-green-600">{APR}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white shadow-md border-none overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/#how-it-works')}>
                        <Wallet className="mr-2 h-4 w-4" />
                        Make New Investment
                      </Button>
                      <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
                        <LineChart className="mr-2 h-4 w-4" />
                        View Detailed Analytics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="allocation">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white shadow-md border-none overflow-hidden">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="flex items-center">
                    <PieChartIcon className="mr-2 h-5 w-5 text-purple-600" />
                    Asset Allocation
                  </CardTitle>
                  <CardDescription>Distribution of your investment portfolio</CardDescription>
                </CardHeader>
                <CardContent className="p-6 h-96">
                  {allocationData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={allocationData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={120}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {allocationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={customTooltipFormatter} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-500">No allocation data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-md border-none overflow-hidden">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle>Investment Breakdown</CardTitle>
                  <CardDescription>
                    How your investment is distributed across different VAIOT allocations
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {allocationData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-3" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <span>{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">€{item.value.toFixed(2)}</div>
                          <div className="text-xs text-gray-500">
                            {(item.value / allocationData.reduce((sum, i) => sum + i.value, 0) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 pt-4 border-t">
                    <h4 className="font-medium mb-4">Investment Strategy</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Your VAIOT investment is strategically allocated across different segments to optimize growth while maintaining security through diversification.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-2"></div>
                        <span>65% of your investment is allocated directly to VAIOT tokens</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 mr-2"></div>
                        <span>15% is allocated to staking rewards that generate passive income</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5 mr-2"></div>
                        <span>12% is placed in the growth fund to capitalize on new opportunities</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 mr-2"></div>
                        <span>8% is reserved for liquidity pools to ensure market stability</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {investments.length > 0 && (
            <TabsContent value="staking">
              <StakingTab 
                investments={investments} 
                totalInvested={totalInvested} 
                totalProjectedValue={totalProjectedValue} 
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
