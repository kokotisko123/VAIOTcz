import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Lock, Shield, TrendingUp, Clock, FileText, Unlock, BadgeCheck, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const StakingSection = () => {
  const [completionOpen, setCompletionOpen] = useState(false);
  const [hasInvestments, setHasInvestments] = useState(false);
  const [stakingUnlocked, setStakingUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    const checkInvestments = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const { data: investmentsData, error } = await supabase
          .from('investments')
          .select('*')
          .eq('user_id', user.id);
        
        if (!error && investmentsData && investmentsData.length > 0) {
          setHasInvestments(true);
          setStakingUnlocked(true);
        } else {
          const localInvestments = localStorage.getItem(`vaiot_investments_${user.id}`);
          if (localInvestments) {
            const investments = JSON.parse(localInvestments);
            setHasInvestments(investments.length > 0);
            setStakingUnlocked(investments.length > 0);
          }
        }
      } catch (err) {
        console.error("Error checking investments:", err);
        const localInvestments = localStorage.getItem(`vaiot_investments_${user.id}`);
        if (localInvestments) {
          const investments = JSON.parse(localInvestments);
          setHasInvestments(investments.length > 0);
          setStakingUnlocked(investments.length > 0);
        }
      }
      
      setLoading(false);
    };
    
    checkInvestments();
  }, [user]);

  const handleStakingAttempt = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use staking features.",
        variant: "destructive"
      });
      return;
    }
    
    if (!stakingUnlocked) {
      toast({
        title: "Staking Locked",
        description: "Staking is only available after completing your investment. Please invest first to unlock staking features.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Staking Request Submitted",
        description: "Your staking request has been received. You will see the staked tokens in your dashboard soon.",
        variant: "default"
      });
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="staking" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">VAIOT Staking</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Earn passive income by staking your VAIOT tokens. Our platform offers competitive APY rates and flexible lock-up periods.
          </p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto"
        >
          <motion.div variants={itemVariants}>
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center space-x-2 pb-2">
                <TrendingUp className="h-6 w-6 text-blue-500" />
                <CardTitle className="text-lg font-semibold">Up to 17.6% APY</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Earn up to 17.6% Annual Percentage Yield on your staked VAIOT tokens.</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
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
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
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
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto"
        >
          {loading ? (
            <div className="w-full h-64 bg-white rounded-lg shadow-lg flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <Card className={`overflow-hidden border-2 ${stakingUnlocked ? 'border-green-400' : 'border-gray-200'} shadow-lg transition-all duration-500`}>
              {stakingUnlocked ? (
                <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 rounded-bl-lg font-medium flex items-center">
                  <Unlock className="h-4 w-4 mr-1" />
                  Unlocked
                </div>
              ) : (
                <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 rounded-bl-lg font-medium">
                  Locked
                </div>
              )}
              
              <div className="p-8 text-center">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex justify-center mb-6"
                >
                  {stakingUnlocked ? (
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                      <BadgeCheck className="h-10 w-10 text-green-500" />
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                      <Lock className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                </motion.div>
                
                <h3 className="text-2xl font-bold mb-4">
                  {stakingUnlocked ? 'VAIOT Staking Available' : 'Staking Currently Unavailable'}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {stakingUnlocked 
                    ? 'Congratulations! You can now stake your VAIOT tokens and earn up to 17.6% APY. Choose your preferred staking period and start earning passive income.'
                    : 'To unlock VAIOT staking features with up to 17.6% APY, you need to complete an investment first. Staking is only available to VAIOT token holders.'
                  }
                </p>
                
                {stakingUnlocked && (
                  <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-100">
                    <div className="font-medium text-green-800 mb-2">Available Staking Plans:</div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="p-2 bg-white rounded border border-green-200">
                        <div className="font-bold">30 Days</div>
                        <div className="text-green-600">1.3% APY</div>
                      </div>
                      <div className="p-2 bg-white rounded border border-green-200">
                        <div className="font-bold">90 Days</div>
                        <div className="text-green-600">4.0% APY</div>
                      </div>
                      <div className="p-2 bg-white rounded border border-green-200">
                        <div className="font-bold">365 Days</div>
                        <div className="text-green-600">17.6% APY</div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-8">
                  {stakingUnlocked ? (
                    <Button 
                      className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 transition-all duration-200 transform hover:scale-105"
                      onClick={handleStakingAttempt}
                    >
                      <Award className="h-4 w-4 mr-2" />
                      Start Staking Now
                    </Button>
                  ) : (
                    <Button 
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 cursor-not-allowed" 
                      onClick={handleStakingAttempt}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Staking Locked
                    </Button>
                  )}
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  {stakingUnlocked 
                    ? 'You can stake any amount of tokens from your VAIOT holdings'
                    : 'Invest in VAIOT tokens through the "How It Works" section to unlock staking'
                  }
                </div>
              </div>
            </Card>
          )}
        </motion.div>

        <div className="mt-16 text-center">
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-2xl font-bold mb-4">Stay Informed About Market Trends</h3>
            <p className="text-gray-600 mb-6">
              Subscribe to our newsletter to receive regular updates on cryptocurrency market trends, investment opportunities, and platform features.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <input 
                type="email" 
                className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 border border-gray-200" 
                placeholder="Enter your email address" 
              />
              <Button className="bg-blue-600 hover:bg-blue-700 transition-colors">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a 
            href="https://vaiot.ai/assets/files/VAIOT_Whitepaper.pdf" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FileText className="h-5 w-5 mr-2" />
            Download VAIOT Whitepaper
          </a>
        </div>
      </div>
    </section>
  );
};

export default StakingSection;
