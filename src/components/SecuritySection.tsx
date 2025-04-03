
import React from 'react';
import { Shield, Lock, FileCheck, CheckCircle2 } from 'lucide-react';

const SecuritySection = () => {
  return (
    <section className="container-section">
      <div className="flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
          <h2 className="heading-lg mb-6">
            Security You Can <span className="text-investment-blue">Trust</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            We prioritize the security of your investments and personal information. Our platform employs enterprise-grade security measures to ensure your transactions are protected at all times.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 p-1">
                <CheckCircle2 className="h-6 w-6 text-investment-green" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">SSL Encryption</h3>
                <p className="mt-1 text-gray-600">All data is encrypted using industry-standard SSL protocols to prevent unauthorized access.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 p-1">
                <CheckCircle2 className="h-6 w-6 text-investment-green" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
                <p className="mt-1 text-gray-600">Add an extra layer of security to your account with our advanced 2FA system.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 p-1">
                <CheckCircle2 className="h-6 w-6 text-investment-green" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Regular Security Audits</h3>
                <p className="mt-1 text-gray-600">Our platform undergoes regular security audits by independent third-party experts.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-r from-investment-blue to-blue-500 rounded-xl"></div>
            <div className="relative bg-white rounded-xl shadow-xl p-8 z-10">
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-blue-50 rounded-full">
                  <Shield className="h-12 w-12 text-investment-blue" />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-center mb-6">Our Security Commitment</h3>
              
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Lock className="h-5 w-5 text-investment-blue mr-3" />
                  <span className="text-gray-700">Multi-layer wallet protection</span>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <FileCheck className="h-5 w-5 text-investment-blue mr-3" />
                  <span className="text-gray-700">Transparent transaction records</span>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Shield className="h-5 w-5 text-investment-blue mr-3" />
                  <span className="text-gray-700">Regulatory compliance</span>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <a href="#" className="text-investment-blue hover:underline flex items-center justify-center">
                  <span>Read our full security policy</span>
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
