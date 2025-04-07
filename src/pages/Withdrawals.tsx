
import React, { useState } from "react";
import { Clock, FileText, ArrowDown, Check, X, RefreshCw, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";

interface WithdrawalRequest {
  id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  walletAddress?: string;
}

const Withdrawals = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [loading, user, navigate]);

  // Load withdrawal requests from localStorage
  React.useEffect(() => {
    if (user) {
      const savedRequests = localStorage.getItem(`vaiot_withdrawals_${user.id}`);
      if (savedRequests) {
        try {
          setWithdrawalRequests(JSON.parse(savedRequests));
        } catch (e) {
          console.error("Error parsing withdrawal requests:", e);
        }
      }
    }
  }, [user]);

  const handleSubmitWithdrawal = () => {
    if (!user) return;
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    if (!walletAddress || walletAddress.length < 10) {
      alert("Please enter a valid wallet address");
      return;
    }

    const newRequest: WithdrawalRequest = {
      id: Math.random().toString(36).substring(2, 15),
      amount: parseFloat(amount),
      status: 'pending',
      createdAt: new Date().toISOString(),
      walletAddress
    };

    const updatedRequests = [...withdrawalRequests, newRequest];
    setWithdrawalRequests(updatedRequests);
    localStorage.setItem(`vaiot_withdrawals_${user.id}`, JSON.stringify(updatedRequests));

    setAmount("");
    setWalletAddress("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null; // This shouldn't render due to redirect
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4">
            <Card className="sticky top-24">
              <CardHeader className="bg-blue-50 border-b">
                <CardTitle className="flex items-center text-lg">
                  <Clock className="mr-2 h-5 w-5 text-blue-600" />
                  Account Navigation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => navigate("/profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile Info
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800"
                    onClick={() => navigate("/withdrawals")}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Withdrawal Requests
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => navigate("/account-settings")}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Account Settings
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          <div className="w-full md:w-3/4 space-y-6">
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle className="text-xl">Withdrawal Requests</CardTitle>
                <CardDescription className="text-blue-100">
                  Request withdrawals and track their status
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                  <h3 className="font-medium mb-2 flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-blue-600" />
                    New Withdrawal Request
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                        Amount (EUR)
                      </label>
                      <Input
                        id="amount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="wallet" className="block text-sm font-medium text-gray-700 mb-1">
                        Wallet Address
                      </label>
                      <Input
                        id="wallet"
                        type="text"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        placeholder="0x..."
                        className="bg-white"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleSubmitWithdrawal} 
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <ArrowDown className="mr-2 h-4 w-4" />
                    Submit Withdrawal Request
                  </Button>
                </div>

                <h3 className="font-medium mb-4">Your Withdrawal History</h3>
                
                {withdrawalRequests.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <h4 className="text-lg font-medium text-gray-600 mb-1">No withdrawal requests yet</h4>
                    <p className="text-gray-500">Use the form above to create your first withdrawal request</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Date</th>
                          <th className="py-3 px-4 text-right text-sm font-medium text-gray-600">Amount</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Wallet</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {withdrawalRequests.map((request) => (
                          <tr key={request.id} className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {format(new Date(request.createdAt), 'MMM d, yyyy')}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium">
                              €{request.amount.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {request.walletAddress ? (
                                <span className="truncate inline-block max-w-[150px]">
                                  {request.walletAddress}
                                </span>
                              ) : (
                                <span className="text-gray-400">N/A</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {request.status === 'pending' && (
                                <span className="inline-flex items-center bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                                  <RefreshCw className="h-3 w-3 mr-1" />
                                  Pending
                                </span>
                              )}
                              {request.status === 'approved' && (
                                <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                  <Check className="h-3 w-3 mr-1" />
                                  Approved
                                </span>
                              )}
                              {request.status === 'rejected' && (
                                <span className="inline-flex items-center bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                                  <X className="h-3 w-3 mr-1" />
                                  Rejected
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Withdrawal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm text-gray-600">
                  <p>• Withdrawal requests are typically processed within 1-3 business days</p>
                  <p>• The minimum withdrawal amount is €100</p>
                  <p>• Make sure your wallet address is correct as transactions cannot be reversed</p>
                  <p>• You will receive email notifications about the status of your withdrawal requests</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdrawals;
