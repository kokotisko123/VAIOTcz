import React from 'react';
import { Shield, TrendingUp, RefreshCw, Database, Wallet, Clock } from 'lucide-react';
const Features = () => {
  const features = [{
    icon: <Shield className="h-8 w-8 text-investment-accent bg-slate-50 rounded-full" />,
    title: 'Enterprise-Grade Security',
    description: 'Advanced security protocols protect your assets and personal information at all times.'
  }, {
    icon: <TrendingUp className="h-8 w-8 text-investment-accent" />,
    title: 'Real-Time Data Updates',
    description: 'Get the latest token prices and market trends with automatic real-time updates.'
  }, {
    icon: <RefreshCw className="h-8 w-8 text-investment-accent" />,
    title: 'Dynamic Conversion',
    description: 'Instantly convert between EUR and VAIOT tokens with our responsive calculation engine.'
  }, {
    icon: <Database className="h-8 w-8 text-investment-accent" />,
    title: 'Staking Opportunities',
    description: "Maximize your returns with flexible staking options once you've acquired tokens."
  }, {
    icon: <Wallet className="h-8 w-8 text-investment-accent" />,
    title: 'Seamless Wallet Integration',
    description: 'Connect your preferred crypto wallet with one click for a smooth experience.'
  }, {
    icon: <Clock className="h-8 w-8 text-investment-accent" />,
    title: 'Quick Transaction Processing',
    description: 'Experience fast transaction confirmations and minimal waiting times.'
  }];
  return <section id="features" className="container-section bg-gray-50">
      <div className="text-center mb-16">
        <h2 className="heading-lg mb-4 font-extrabold">
          Why Choose <span className="text-investment-blue font-extrabold text-6xl">VAIOT</span>
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto text-center text-lg font-light">
          Our platform combines cutting-edge technology with intuitive design to create a seamless investment experience focused on security and growth.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => <div key={index} className="card-investment flex flex-col items-start hover:translate-y-[-5px] bg-gray-100">
            <div className="mb-4 p-3 rounded-3xl bg-slate-50">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-investment-dark">
              {feature.title}
            </h3>
            <p className="text-gray-600">
              {feature.description}
            </p>
          </div>)}
      </div>
    </section>;
};
export default Features;