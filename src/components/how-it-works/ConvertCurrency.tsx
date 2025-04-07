
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { RefreshCw, Loader2, Check } from 'lucide-react';
import { useAuth, saveInvestment } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Input } from '../ui/input';

interface ConvertCurrencyProps {
  isConnected: boolean;
  selectedWallet: string;
  eurAmount: string;
  setEurAmount: (value: string) => void;
  vaiotTokens: string;
  prices: any;
  onPrevStep: () => void;
  onNextStep: () => void;
  setIsConnected: (value: boolean) => void;
}

const ConvertCurrency: React.FC<ConvertCurrencyProps> = ({
  isConnected,
  selectedWallet,
  eurAmount,
  setEurAmount,
  vaiotTokens,
  prices,
  onPrevStep,
  onNextStep,
  setIsConnected
}) => {
  const [processing, setProcessing] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [ethAmount, setEthAmount] = useState("");

  // Update ETH amount when EUR amount changes
  const handleEurChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEurAmount(value);
    
    if (prices?.ethereum?.eur && value) {
      const floatValue = parseFloat(value) || 0;
      setEthAmount((floatValue / prices.ethereum.eur).toFixed(6));
    }
  };

  // Process investment with a delay to simulate blockchain transaction
  const handleInvest = async () => {
    const ethValue = parseFloat(ethAmount);
    const eurValue = parseFloat(eurAmount);

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to make an investment",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!ethAmount || !eurAmount || isNaN(ethValue) || isNaN(eurValue)) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to invest",
        variant: "destructive",
      });
      return;
    }

    if (ethValue < 0.01) {
      toast({
        title: "Minimum Investment",
        description: "The minimum investment amount is 0.01 ETH",
        variant: "destructive",
      });
      return;
    }

    // Save investment data with current timestamp
    const investment = {
      ethAmount: ethValue,
      eurValue: eurValue,
      timestamp: new Date().toISOString(),
    };

    setProcessing(true);
    
    // Simulate processing time (3 seconds)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    try {
      // Save to both localStorage and try to save to Supabase
      if (user) {
        await saveInvestment(user.id, investment);
      }
      
      setProcessingComplete(true);
      
      toast({
        title: "Investment Processed!",
        description: `Your investment of ${investment.ethAmount} ETH (€${investment.eurValue}) has been successfully processed.`,
      });
      
      // Wait another second before redirecting or completing
      setTimeout(() => {
        setProcessing(false);
        setProcessingComplete(false);
        onNextStep();
      }, 1000);
    } catch (error) {
      console.error("Error saving investment:", error);
      setProcessing(false);
      
      toast({
        title: "Error",
        description: "There was an error processing your investment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center py-6">
      <div className="mb-8 w-full max-w-lg">
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          {isConnected && (
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Connected with {selectedWallet}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsConnected(false)}>Disconnect</Button>
            </div>
          )}
          
          {prices ? (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Current Rates:</span>
                <span className="text-gray-700">1 ETH = €{prices.ethereum.eur.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">VAIOT Token:</span>
                <span className="text-gray-700">€{prices.vaiot.eur.toFixed(4)}</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center my-2">
              <RefreshCw className="text-gray-400 animate-spin" />
            </div>
          )}
          
          <div className="mb-6">
            <label htmlFor="eurAmount" className="block text-sm font-medium text-gray-700 mb-1">Amount in EUR</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">€</span>
              </div>
              <input
                type="text"
                name="eurAmount"
                id="eurAmount"
                className="focus:ring-investment-blue focus:border-investment-blue block w-full pl-8 pr-12 sm:text-sm border-gray-300 rounded-md py-3"
                placeholder="0.00"
                value={eurAmount}
                onChange={handleEurChange}
                disabled={processing}
              />
            </div>
          </div>

          <div>
            <label htmlFor="ethAmount" className="block text-sm font-medium text-gray-700 mb-1">Amount in ETH</label>
            <div className="relative">
              <Input
                id="ethAmount"
                type="text"
                value={ethAmount}
                className="w-full pr-12"
                disabled={true}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500">ETH</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center my-4">
            <RefreshCw className={`text-gray-400 ${!prices ? 'animate-spin' : 'animate-pulse-subtle'}`} />
          </div>
          
          <div>
            <label htmlFor="vaiotAmount" className="block text-sm font-medium text-gray-700 mb-1">Equivalent in VAIOT Tokens</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                name="vaiotAmount"
                id="vaiotAmount"
                className="focus:ring-investment-blue focus:border-investment-blue block w-full pr-12 sm:text-sm border-gray-300 rounded-md py-3 bg-gray-100"
                value={vaiotTokens}
                readOnly
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">VAIOT</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Exchange Rate</span>
              <span className="text-gray-700">1 VAIOT = {prices ? `€${prices.vaiot.eur.toFixed(4)}` : 'Loading...'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Last Updated</span>
              <span className="text-gray-700">{prices ? 'Just now' : 'Loading...'}</span>
            </div>
          </div>
          
          {processing && (
            <div className="bg-green-50 p-4 rounded-lg flex items-center justify-center mt-4">
              {!processingComplete ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                  <span className="text-green-700 font-medium">Processing your investment...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-green-700 font-medium">Investment successfully processed!</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          variant="outline"
          onClick={onPrevStep}
          disabled={processing}
        >
          Back
        </Button>
        <Button 
          className="btn-primary bg-investment-blue hover:bg-blue-700"
          onClick={handleInvest}
          disabled={!prices || processing || !eurAmount || parseFloat(eurAmount) <= 0}
        >
          Invest Now
        </Button>
      </div>
    </div>
  );
};

export default ConvertCurrency;
