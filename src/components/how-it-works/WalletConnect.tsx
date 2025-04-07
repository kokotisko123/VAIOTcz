import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Loader2, Wallet } from "lucide-react";
interface WalletConnectProps {
  loading?: boolean;
  selectedWallet?: string;
  connectWallet?: (walletName: string) => void;
  error?: Error | null;
  onComplete?: () => void;
}
export default function WalletConnect({
  loading,
  selectedWallet,
  connectWallet,
  error,
  onComplete
}: WalletConnectProps = {}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    toast
  } = useToast();
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const handleConnectWallet = (walletProvider: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to connect your wallet",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }
    setIsProcessing(true);

    // Simulate wallet connection process
    setTimeout(() => {
      setIsProcessing(false);
      if (connectWallet) {
        connectWallet(walletProvider);
      }
    }, 1500);
  };
  return <div className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Choose Your Wallet</h3>
          <p className="text-gray-500 mt-1">Connect your preferred wallet to continue</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Button onClick={() => handleConnectWallet("MetaMask")} disabled={isProcessing || loading} variant="outline" className="py-6 border-2 hover:border-blue-500 hover:bg-blue-50 flex flex-col items-center justify-center h-[120px]">
            <div className="w-12 h-12 mb-2 flex items-center justify-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-10 h-10" />
            </div>
            <span>MetaMask</span>
          </Button>

          <Button onClick={() => handleConnectWallet("TrustWallet")} disabled={isProcessing || loading} variant="outline" className="py-6 border-2 hover:border-blue-500 hover:bg-blue-50 flex flex-col items-center justify-center h-[120px]">
            <div className="w-12 h-12 mb-2 flex items-center justify-center">
              <img alt="Trust Wallet" className="w-10 h-10" src="/lovable-uploads/669d9847-093a-49d5-b629-5fa45399b93a.png" />
            </div>
            <span>Trust Wallet</span>
          </Button>

          <Button onClick={() => handleConnectWallet("CoinbaseWallet")} disabled={isProcessing || loading} variant="outline" className="py-6 border-2 hover:border-blue-500 hover:bg-blue-50 flex flex-col items-center justify-center h-[120px]">
            <div className="w-12 h-12 mb-2 flex items-center justify-center">
              <img alt="Coinbase Wallet" className="w-10 h-10" src="/lovable-uploads/cbf3d8f1-efab-4a33-ab5b-4874be6a7d6e.png" />
            </div>
            <span>Coinbase Wallet</span>
          </Button>

          <Button onClick={() => handleConnectWallet("WalletConnect")} disabled={isProcessing || loading} variant="outline" className="py-6 border-2 hover:border-blue-500 hover:bg-blue-50 flex flex-col items-center justify-center h-[120px]">
            <div className="w-12 h-12 mb-2 flex items-center justify-center">
              <img alt="WalletConnect" className="w-10 h-10" src="/lovable-uploads/942fc209-49d8-4f18-9cac-c5afdd790780.png" />
            </div>
            <span>WalletConnect</span>
          </Button>
        </div>

        {isProcessing && <div className="mt-6 text-center p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-center items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="text-blue-700 font-medium">Connecting wallet...</span>
            </div>
          </div>}

        {error && <div className="bg-red-50 p-4 rounded-lg mt-4">
            <p className="text-red-700 text-center">Error connecting to wallet: {error.message}</p>
          </div>}

        {selectedWallet && <div className="bg-green-50 p-4 rounded-lg mt-4 flex items-center justify-center space-x-2">
            <div className="flex items-center space-x-2">
              <Wallet className="h-5 w-5 text-green-600" />
              <span className="text-green-700 font-medium">Connected with {selectedWallet}</span>
            </div>
          </div>}
      </div>
    </div>;
}