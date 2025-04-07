
import React, { useState, useEffect } from 'react';
import { Wallet, RefreshCw, SendHorizonal } from 'lucide-react';
import { useCryptoPrices } from '../hooks/useCryptoPrices';
import StepIndicator from './how-it-works/StepIndicator';
import StepHeader from './how-it-works/StepHeader';
import WalletConnect from './how-it-works/WalletConnect';
import ConvertCurrency from './how-it-works/ConvertCurrency';
import CompleteTransaction from './how-it-works/CompleteTransaction';

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [ethAmount, setEthAmount] = useState('1');
  const [eurAmount, setEurAmount] = useState('1000');
  const [isConnected, setIsConnected] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState('');
  const [loading, setLoading] = useState(false);
  
  const {
    prices,
    error,
    isLoading: pricesLoading
  } = useCryptoPrices();

  // Calculate VAIOT tokens based on EUR input
  const calculateVaiotFromEur = () => {
    if (!prices || !eurAmount) return '0';
    return (parseFloat(eurAmount) / prices.vaiot.eur).toFixed(2);
  };

  // Calculate ETH equivalent of EUR
  const calculateEthFromEur = () => {
    if (!prices || !eurAmount) return '0';
    return (parseFloat(eurAmount) / prices.ethereum.eur).toFixed(6);
  };

  // Update ETH amount when EUR changes
  useEffect(() => {
    if (prices) {
      setEthAmount(calculateEthFromEur());
    }
  }, [eurAmount, prices]);

  const connectWallet = (walletName: string) => {
    setLoading(true);

    // Simulate wallet connection
    setTimeout(() => {
      setIsConnected(true);
      setSelectedWallet(walletName);
      setLoading(false);
      setActiveStep(2);
    }, 1500);
  };

  const vaiotTokens = calculateVaiotFromEur();

  const steps = [
    {
      number: 1,
      title: "Connect Your Wallet",
      description: "Securely link your cryptocurrency wallet to begin the investment process.",
      icon: <Wallet className="h-6 w-6" />
    },
    {
      number: 2,
      title: "Convert EUR to VAIOT",
      description: "Specify the amount of EUR you wish to invest and see the equivalent VAIOT tokens in real-time.",
      icon: <RefreshCw className="h-6 w-6" />
    },
    {
      number: 3,
      title: "Complete Transaction",
      description: "Send ETH to the generated unique address and provide your VAIOT wallet for token delivery.",
      icon: <SendHorizonal className="h-6 w-6" />
    }
  ];

  return (
    <section id="how-it-works" className="container-section">
      <div className="text-center mb-16">
        <h2 className="heading-lg mb-4 font-extrabold text-6xl">How It Works</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Start your investment journey in just a few simple steps. Our streamlined process ensures a smooth experience from wallet connection to token acquisition.
        </p>
      </div>

      {/* Steps Indicator */}
      <StepIndicator activeStep={activeStep} setActiveStep={setActiveStep} steps={steps} />

      {/* Active Step Content */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <StepHeader icon={steps[activeStep - 1].icon} title={`Step ${activeStep}: ${steps[activeStep - 1].title}`} description={steps[activeStep - 1].description} />

        <div className="p-6">
          {activeStep === 1 && 
            <WalletConnect 
              loading={loading} 
              selectedWallet={selectedWallet} 
              connectWallet={connectWallet} 
              error={error} 
              onComplete={() => setActiveStep(2)} 
            />
          }
          
          {activeStep === 2 && 
            <ConvertCurrency 
              isConnected={isConnected} 
              selectedWallet={selectedWallet} 
              eurAmount={eurAmount} 
              setEurAmount={setEurAmount} 
              vaiotTokens={vaiotTokens} 
              prices={prices} 
              onPrevStep={() => setActiveStep(1)} 
              onNextStep={() => setActiveStep(3)} 
              setIsConnected={setIsConnected} 
            />
          }
          
          {activeStep === 3 && 
            <CompleteTransaction 
              ethAmount={ethAmount} 
              prices={prices} 
              onPrevStep={() => setActiveStep(2)} 
            />
          }
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-gray-600">
          Need help with the process? <a href="#" className="text-investment-blue hover:underline">Contact our support team</a>
        </p>
      </div>
    </section>
  );
};

export default HowItWorks;
