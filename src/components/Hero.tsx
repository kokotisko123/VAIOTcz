import React from 'react';
import { ArrowRight, ArrowDownCircle } from 'lucide-react';
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
  return <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-cover bg-center z-0" style={{
      backgroundImage: 'url(https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2832&auto=format&fit=crop)',
      backgroundBlendMode: 'overlay'
    }}>
        <div className="absolute inset-0 bg-gradient-to-r from-investment-dark/90 to-investment-blue/70"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight animate-fade-in lg:text-6xl">
              Invest with Confidence in the <span className="text-gradient-gold">VAIOT PRIVATE</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-xl mx-auto md:mx-0 animate-fade-in" style={{
            animationDelay: '0.2s'
          }}>
              A professional investment platform designed for modern investors. Secure, transparent, and built for growth.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in" style={{
            animationDelay: '0.4s'
          }}>
              <Button className="btn-accent flex items-center space-x-2 transform hover:scale-105 transition-all" onClick={scrollToWallet}>
                <span>Start Investing Now</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="bg-transparent border border-white text-white hover:bg-white/10 flex items-center space-x-2">
                <span>Explore Features</span>
              </Button>
            </div>
          </div>
          
          <div className="md:w-1/2 mt-12 md:mt-0 animate-fade-in" style={{
          animationDelay: '0.6s'
        }}>
            <div className="glass-effect rounded-xl p-6 md:p-8 max-w-md mx-auto bg-zinc-50">
              <div className="bg-white/90 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-investment-dark mb-4">Current Market Overview</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm text-gray-500 font-extrabold">ETH Price</span>
                      <p className="font-semibold text-investment-dark">$3,245.78</p>
                    </div>
                    <div className="text-investment-green font-medium flex items-center">
                      +2.4% <span className="ml-1">↑</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm text-gray-500 font-bold">VAIOT Token</span>
                      <p className="font-semibold text-investment-dark">$0.427</p>
                    </div>
                    <div className="text-investment-green font-medium flex items-center">
                      +5.1% <span className="ml-1">↑</span>
                    </div>
                  </div>
                  
                  <Button onClick={scrollToWallet} className="w-full text-white bg-slate-900 hover:bg-slate-800">
                    Connect Wallet to Start
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <a href="#features" className="text-white flex flex-col items-center my-0 px-0 mx-[-300px]">
          <span className="text-sm mb-2">Scroll to learn more</span>
          <ArrowDownCircle className="h-6 w-6" />
        </a>
      </div>
    </div>;
};
export default Hero;