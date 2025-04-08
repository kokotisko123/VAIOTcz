import React, { useState, useEffect } from 'react';
import { Check, Copy, RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

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
  const [confirmationStep, setConfirmationStep] = useState<'initial' | 'processing' | 'confirmed'>('initial');
  const [countdown, setCountdown] = useState(30); // 30 second countdown
  const paymentAddress = "0x2ac46b14A803B060CC24Cd2Ac35311826E1a3200"; // Updated fixed address
  const { toast } = useToast();
  const navigate = useNavigate();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentAddress);
    setCopied(true);
    
    toast({
      title: "Address Copied!",
      description: "ETH address has been copied to clipboard."
    });
    
    setTimeout(() => setCopied(false), 3000);
  };

  const simulateTransaction = () => {
    setConfirmationStep('processing');
    
    // Simulate a processing delay
    setTimeout(() => {
      setConfirmationStep('confirmed');
    }, 5000);
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  // Countdown logic
  useEffect(() => {
    if (confirmationStep !== 'processing') return;
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [confirmationStep]);

  return (
    <div className="flex flex-col items-center py-6">
      <div className="mb-8 w-full max-w-lg">
        {confirmationStep === 'initial' && (
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-medium text-center mb-4">Complete Your Investment</h3>
            <p className="text-gray-600 mb-6">Send exactly <span className="font-semibold">{ethAmount} ETH</span> to the following address:</p>
            
            <div className="mb-6">
              <div className="bg-white p-4 rounded-lg flex items-center justify-between border border-gray-200">
                <div className="overflow-x-auto font-mono text-sm text-gray-800 mr-2">
                  {paymentAddress}
                </div>
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={copyToClipboard}
                  className="flex-shrink-0"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Please only send ETH from a wallet you control. Do not send from an exchange.</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg mb-6 border border-yellow-100">
              <h4 className="font-medium text-yellow-800 mb-1">Important:</h4>
              <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                <li>Send exactly {ethAmount} ETH to the above address</li>
                <li>Transactions usually take 1-5 minutes to process</li>
                <li>Only send ETH on the Ethereum network</li>
              </ul>
            </div>
            
            <Button 
              className="w-full bg-investment-blue hover:bg-blue-700"
              onClick={simulateTransaction}
            >
              I've Sent the ETH
            </Button>
          </div>
        )}

        {confirmationStep === 'processing' && (
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
            <div className="flex flex-col items-center justify-center text-center">
              <RefreshCw className="h-12 w-12 text-blue-600 animate-spin mb-4" />
              <h3 className="text-lg font-medium mb-2">Processing Your Transaction</h3>
              <p className="text-gray-600 mb-4">We're confirming your payment on the blockchain. This may take a few moments.</p>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${((30 - countdown) / 30) * 100}%` }}></div>
              </div>
              <p className="text-sm text-gray-500">Estimated time remaining: {countdown} seconds</p>
            </div>
          </div>
        )}

        {confirmationStep === 'confirmed' && (
          <div className="bg-green-50 rounded-xl p-6 border border-green-100">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Transaction Confirmed!</h3>
              <p className="text-gray-600 mb-6">Your VAIOT tokens have been successfully added to your portfolio.</p>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 w-full mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Amount Invested:</span>
                  <span className="font-medium">{ethAmount} ETH</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Status:</span>
                  <span className="text-green-600 font-medium">Complete</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaction ID:</span>
                  <span className="font-mono text-xs text-gray-700 truncate max-w-[180px]">0x72f5dab31c81c8f5915f93eda63864e14e48b2c75e2f</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center"
                onClick={goToDashboard}
              >
                View Your Portfolio
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {confirmationStep === 'initial' && (
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            variant="outline"
            onClick={onPrevStep}
          >
            Back
          </Button>
        </div>
      )}
    </div>
  );
};

export default CompleteTransaction;
