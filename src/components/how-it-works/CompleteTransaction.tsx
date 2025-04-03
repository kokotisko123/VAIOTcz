
import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '../ui/button';
import InvestmentCompletionPopup from '../InvestmentCompletionPopup';

interface CompleteTransactionProps {
  ethAmount: string;
  prices: any;
  onPrevStep: () => void;
}

const CompleteTransaction: React.FC<CompleteTransactionProps> = ({ 
  ethAmount, 
  prices, 
  onPrevStep 
}) => {
  const [copied, setCopied] = useState(false);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { toast } = useToast();
  const ethAddress = "0xe9224e0074E2f95Ac1fFEd239E905E326722505d";

  // Check if user has already submitted an investment
  useEffect(() => {
    const storedSubmission = localStorage.getItem('vaiot_investment_pending');
    if (storedSubmission) {
      setHasSubmitted(true);
    }
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(ethAddress);
      setCopied(true);
      toast({
        title: "Address Copied",
        description: "Ethereum address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the address to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleComplete = () => {
    if (hasSubmitted) {
      toast({
        title: "Investment Already Pending",
        description: "We are still approving your investment, please hold tight. Thanks!",
        variant: "destructive",
      });
      return;
    }

    if (!copied) {
      toast({
        title: "Copy Address First",
        description: "Please copy the Ethereum address before completing your purchase",
        variant: "destructive",
      });
      return;
    }

    // Store submission in local storage
    localStorage.setItem('vaiot_investment_pending', 'true');
    setHasSubmitted(true);
    setShowCompletionPopup(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Complete Transaction</h3>
        <p className="mb-4 text-gray-600">
          Send your cryptocurrency to our secure platform to complete your VAIOT investment. We support various payment methods for your convenience.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-4">
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Send exactly:</p>
          <p className="text-2xl font-bold">{ethAmount} ETH</p>
          {prices && (
            <p className="text-sm text-gray-500">≈ €{(parseFloat(ethAmount) * prices.ethereum.eur).toFixed(2)}</p>
          )}
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">To this Ethereum address:</p>
          <div className="bg-white p-4 rounded-lg flex items-center justify-between border border-gray-200">
            <code className="text-sm sm:text-base font-mono break-all">{ethAddress}</code>
            <button 
              onClick={copyToClipboard} 
              className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
              aria-label="Copy Ethereum address"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span className="ml-1 hidden sm:inline">Copy</span>
            </button>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-2">Important:</p>
          <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
            <li>Send only ETH to this address</li>
            <li>Make sure to include enough gas fees</li>
            <li>Transaction may take 10-30 minutes to complete</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Button 
          variant="outline"
          onClick={onPrevStep}
        >
          Back
        </Button>
        <Button 
          className={`${hasSubmitted ? 'bg-gray-400 hover:bg-gray-500' : 'bg-investment-blue hover:bg-blue-800'} text-white`}
          onClick={handleComplete}
          disabled={hasSubmitted}
        >
          {hasSubmitted ? "Investment Pending" : "Complete Purchase"}
        </Button>
      </div>

      <InvestmentCompletionPopup 
        open={showCompletionPopup} 
        onClose={() => setShowCompletionPopup(false)} 
      />
    </div>
  );
};

export default CompleteTransaction;
