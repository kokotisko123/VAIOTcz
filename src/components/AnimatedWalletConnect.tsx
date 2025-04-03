
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, Check, X } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import { useToast } from "@/hooks/use-toast";

interface AnimatedWalletConnectProps {
  onConnect: () => void;
}

const AnimatedWalletConnect: React.FC<AnimatedWalletConnectProps> = ({ onConnect }) => {
  const [connectionState, setConnectionState] = useState<
    "idle" | "connecting" | "success" | "error"
  >("idle");
  const { toast } = useToast();

  const handleConnectWallet = () => {
    setConnectionState("connecting");
    
    // Simulate wallet connection process
    setTimeout(() => {
      // 80% chance of successful connection for demo purposes
      const success = Math.random() > 0.2;
      
      if (success) {
        setConnectionState("success");
        toast({
          title: "Wallet connected",
          description: "Your wallet has been connected successfully.",
        });
        
        setTimeout(() => {
          onConnect();
        }, 1000);
      } else {
        setConnectionState("error");
        toast({
          title: "Connection failed",
          description: "Failed to connect wallet. Please try again.",
          variant: "destructive",
        });
        
        setTimeout(() => {
          setConnectionState("idle");
        }, 2000);
      }
    }, 2000);
  };

  const getButtonContent = () => {
    switch (connectionState) {
      case "connecting":
        return (
          <div className="flex items-center space-x-2">
            <LoadingSpinner size={18} />
            <span>Connecting...</span>
          </div>
        );
      case "success":
        return (
          <div className="flex items-center space-x-2 animate-scale-in">
            <Check size={18} className="text-green-500" />
            <span>Connected</span>
          </div>
        );
      case "error":
        return (
          <div className="flex items-center space-x-2 animate-scale-in">
            <X size={18} className="text-red-500" />
            <span>Failed</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2">
            <Wallet size={18} />
            <span>Connect Wallet</span>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 animate-fade-in">
      <div className="relative p-4">
        <div
          className={`absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full opacity-20 transform transition-all duration-500 
            ${connectionState === "connecting" ? "scale-110 animate-pulse" : "scale-100"}`}
        />
        <Button
          onClick={handleConnectWallet}
          disabled={connectionState === "connecting" || connectionState === "success"}
          variant="outline"
          size="lg"
          className={`relative transition-all duration-300 transform hover:scale-105 hover:shadow-lg 
            ${connectionState === "connecting" ? "border-blue-400" : ""} 
            ${connectionState === "success" ? "border-green-500" : ""} 
            ${connectionState === "error" ? "border-red-500" : ""}`}
        >
          {getButtonContent()}
        </Button>
      </div>
      
      {connectionState === "connecting" && (
        <p className="text-sm text-muted-foreground animate-pulse">
          Please approve the connection request in your wallet...
        </p>
      )}
      
      {connectionState === "error" && (
        <p className="text-sm text-red-500 animate-fade-in">
          Connection failed. Please check your wallet and try again.
        </p>
      )}
    </div>
  );
};

export default AnimatedWalletConnect;
