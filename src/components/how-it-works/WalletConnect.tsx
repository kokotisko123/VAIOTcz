import React, { useState, useEffect } from "react";
import { Wallet, Check, X } from "lucide-react";
import StepHeader from "./StepHeader";
import StepIndicator from "./StepIndicator";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
interface WalletConnectProps {
  onComplete: () => void;
  currentStep: number;
  loading?: boolean;
  selectedWallet?: string;
  error?: Error;
  connectWallet?: (walletName: string) => void;
}
const WalletConnect = ({
  onComplete,
  currentStep
}: WalletConnectProps) => {
  const [connectionState, setConnectionState] = useState<"idle" | "connecting" | "success" | "error">("idle");
  const [selectedWallet, setSelectedWallet] = useState<string>("");
  const {
    toast
  } = useToast();

  // This function would normally connect to the actual wallet
  const connectWallet = async (walletName: string) => {
    setSelectedWallet(walletName);
    setConnectionState("connecting");
    try {
      // Check if window.ethereum or other wallet is available
      if (window.ethereum && walletName === "MetaMask") {
        try {
          // Request account access
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          });

          // Successfully connected
          handleSuccessfulConnection(walletName, accounts[0]);
        } catch (error) {
          console.error("Error connecting to MetaMask", error);
          handleConnectionError();
        }
      } else {
        // Simulate connection for demo purposes when real wallets aren't available
        setTimeout(() => {
          const success = Math.random() > 0.2;
          if (success) {
            handleSuccessfulConnection(walletName);
          } else {
            handleConnectionError();
          }
        }, 2000);
      }
    } catch (err) {
      handleConnectionError();
    }
  };
  const handleSuccessfulConnection = (walletName: string, account?: string) => {
    setConnectionState("success");
    toast({
      title: `${walletName} Connected`,
      description: account ? `Connected to account ${account.substring(0, 6)}...${account.substring(account.length - 4)}` : `Your ${walletName} wallet has been connected successfully.`
    });
    setTimeout(() => {
      onComplete();
    }, 1000);
  };
  const handleConnectionError = () => {
    setConnectionState("error");
    toast({
      title: "Connection Failed",
      description: "Failed to connect wallet. Please try again.",
      variant: "destructive"
    });
    setTimeout(() => {
      setConnectionState("idle");
    }, 2000);
  };
  return <div className="flex flex-col items-center animate-fade-in">
      <StepHeader icon={<Wallet className="h-5 w-5 text-white" />} title="Connect your wallet" description="First, connect your crypto wallet to begin the process." />

      <div className="flex justify-center my-8 relative w-full">
        <StepIndicator activeStep={currentStep} setActiveStep={() => {}} steps={[{
        number: 1,
        title: "Connect Wallet",
        description: "Connect your crypto wallet",
        icon: <Wallet className="h-5 w-5" />
      }, {
        number: 2,
        title: "Convert Currency",
        description: "Convert your currency",
        icon: <Wallet className="h-5 w-5" />
      }, {
        number: 3,
        title: "Complete Transaction",
        description: "Finalize your investment",
        icon: <Wallet className="h-5 w-5" />
      }]} />
      </div>

      <div className="bg-card shadow-lg rounded-xl p-8 max-w-md w-full mx-auto border border-border">
        <h3 className="text-2xl font-bold text-center mb-6">Wallet Connection</h3>
        
        <p className="text-center text-muted-foreground mb-8">
          Please connect your wallet to continue with the VAIOT investment process. 
          We support MetaMask, WalletConnect, and other popular providers.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button onClick={() => connectWallet("MetaMask")} disabled={connectionState === "connecting" || connectionState === "success"} variant="outline" className="p-4 h-auto flex flex-col items-center justify-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-10 h-10 mb-2" />
            <span>MetaMask</span>
          </Button>
          
          <Button onClick={() => connectWallet("WalletConnect")} disabled={connectionState === "connecting" || connectionState === "success"} variant="outline" className="p-4 h-auto flex flex-col items-center justify-center">
            <img alt="WalletConnect" className="w-10 h-10 mb-2" src="/lovable-uploads/f3e6edfa-3446-4651-a44f-962c8c96d94b.png" />
            <span>WalletConnect</span>
          </Button>
          
          <Button onClick={() => connectWallet("Trust Wallet")} disabled={connectionState === "connecting" || connectionState === "success"} variant="outline" className="p-4 h-auto flex flex-col items-center justify-center">
            <img alt="Trust Wallet" className="w-10 h-10 mb-2" src="/lovable-uploads/fc154f11-62ec-422a-996c-c3c7db6c01e2.jpg" />
            <span>Trust Wallet</span>
          </Button>
          
          <Button onClick={() => connectWallet("Exodus")} disabled={connectionState === "connecting" || connectionState === "success"} variant="outline" className="p-4 h-auto flex flex-col items-center justify-center">
            <img alt="Exodus" className="w-10 h-10 mb-2 rounded-full" src="/lovable-uploads/4e5af014-423d-4291-b7d4-7155d0ece050.png" />
            <span>Exodus</span>
          </Button>
        </div>

        {connectionState === "connecting" && <div className="text-center py-4 animate-pulse">
            <div className="inline-block w-8 h-8 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm text-muted-foreground">
              Connecting to {selectedWallet}...
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Please confirm the connection in your wallet
            </p>
          </div>}
        
        {connectionState === "success" && <div className="text-center py-4 animate-fade-in text-green-500 flex items-center justify-center">
            <Check className="mr-2" />
            <span>Successfully connected to {selectedWallet}</span>
          </div>}
        
        {connectionState === "error" && <div className="text-center py-4 animate-fade-in text-red-500 flex items-center justify-center">
            <X className="mr-2" />
            <span>Failed to connect. Please try again.</span>
          </div>}
      </div>
    </div>;
};

// Add this for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
export default WalletConnect;