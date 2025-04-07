import React, { useState } from 'react';
import { ArrowRight, ArrowDownCircle, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
const Hero = () => {
  const scrollToWallet = () => {
    // Target the WalletConnect section specifically instead of just the how-it-works section
    const walletSection = document.getElementById('how-it-works');
    if (walletSection) {
      walletSection.scrollIntoView({
        behavior: 'smooth'
      });

      // Find the first step which is the wallet connection step
      setTimeout(() => {
        // This ensures we focus the wallet connection part specifically
        const walletConnectSection = document.querySelector('.bg-card');
        if (walletConnectSection) {
          walletConnectSection.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 500); // Small delay to ensure the main section is in view first
    }
  };
  return <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-cover bg-center z-0" style={{
      backgroundImage: 'url(https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2832&auto=format&fit=crop)',
      backgroundBlendMode: 'overlay'
    }}>
        <div className="absolute inset-0 bg-gradient-to-r from-investment-dark/90 to-investment-blue/70"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="max-w-3xl mx-auto mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight animate-fade-in lg:text-6xl">
              Invest with Confidence in the <span className="text-gradient-gold">VAIOT PRIVATE</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-200 mx-auto animate-fade-in" style={{
            animationDelay: '0.2s'
          }}>
              A professional investment platform designed for modern investors. Secure, transparent, and built for growth.
            </p>
            
            {/* APY Indicator */}
            <div className="mt-6 inline-block">
              <div className="bg-black/30 backdrop-blur-sm px-6 py-3 rounded-lg border border-green-400/30">
                <span className="text-gray-200 font-semibold mr-2">Annual Percentage Yield:</span>
                <span className="text-green-400 font-bold text-xl animate-pulse">17.6% APY</span>
              </div>
            </div>
            
            <div style={{
            animationDelay: '0.4s'
          }} className="mt-10 flex flex-col items-center justify-center space-y-4 animate-fade-in px-0 my-[28px] py-[40px]">
              <Button className="btn-accent flex items-center space-x-2 transform hover:scale-105 transition-all" onClick={scrollToWallet}>
                <span>Start Investing Now</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              
              {/* Safe investment banner */}
              <div className="flex items-center bg-green-100/90 text-green-800 px-4 py-2 rounded-md mt-2">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                <span className="font-medium">Safe investment, guaranteed return.</span>
              </div>
              
              <Button variant="outline" className="bg-transparent border border-white text-white hover:bg-white/10 flex items-center space-x-2">
                <span>Explore Features</span>
              </Button>
            </div>
          </div>
          
          <div className="animate-fade-in" style={{
          animationDelay: '0.6s'
        }}>
            
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        
      </div>
    </div>;
};
export default Hero;