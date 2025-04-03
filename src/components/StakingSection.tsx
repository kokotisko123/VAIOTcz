import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Lock, Shield, TrendingUp, Clock, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const StakingSection = () => {
  const [completionOpen, setCompletionOpen] = useState(false);
  const {
    toast
  } = useToast();
  const handleStakingAttempt = () => {
    toast({
      title: "Staking Locked",
      description: "Staking is only available after completing your investment. Please invest first to unlock staking features.",
      variant: "destructive"
    });
  };
  return <section id="staking" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">VAIOT Staking</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Earn passive income by staking your VAIOT tokens. Our platform offers competitive APY rates and flexible lock-up periods.
          </p>
        </div>

        {/* Added benefits section to fill empty space */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center space-x-2 pb-2">
              <TrendingUp className="h-6 w-6 text-blue-500" />
              <CardTitle className="text-lg font-semibold">Up to 17.6% APY</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Up to 17.6% APY</p>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center space-x-2 pb-2">
              <Clock className="h-6 w-6 text-blue-500" />
              <CardTitle className="text-lg font-semibold">Flexible Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Choose from multiple staking periods ranging from 30 days to 365 days.
                Flexible options to suit your investment timeline.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center space-x-2 pb-2">
              <Shield className="h-6 w-6 text-blue-500" />
              <CardTitle className="text-lg font-semibold">Secure Staking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Your staked assets are secured by industry-leading blockchain technology
                and protected by advanced security protocols.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden border-2 border-gray-200 relative">
          <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 rounded-bl-lg font-medium">
            Locked
          </div>
          
          <div className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <Lock className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Staking Currently Unavailable</h3>
            <p className="text-gray-600 mb-6">To unlock VAIOT staking features with up to 17.6% APY, you need to complete an investment first. Staking is only available to VAIOT token holders.</p>
            
            <div className="mt-8">
              <Button className="bg-gray-300 hover:bg-gray-400 text-gray-700 cursor-not-allowed" onClick={handleStakingAttempt}>
                <Lock className="h-4 w-4 mr-2" />
                Staking Locked
              </Button>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              Invest in VAIOT tokens through the "How It Works" section to unlock staking
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-2xl font-bold mb-4">Stay Informed About Market Trends</h3>
            <p className="text-gray-600 mb-6">
              Subscribe to our newsletter to receive regular updates on cryptocurrency market trends, investment opportunities, and platform features.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <input type="email" className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" placeholder="Enter your email address" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a href="https://vaiot.ai/assets/files/VAIOT_Whitepaper.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <FileText className="h-5 w-5 mr-2" />
            Download VAIOT Whitepaper
          </a>
        </div>
      </div>
    </section>;
};
export default StakingSection;