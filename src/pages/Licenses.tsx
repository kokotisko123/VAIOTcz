
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Licenses = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link to="/">
              <Button variant="ghost" className="mb-6 -ml-4 text-investment-blue">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>

            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-investment-dark">Regulatory Licenses</h1>
            <div className="h-1 w-20 bg-investment-accent mb-8"></div>

            <p className="text-lg text-gray-700 mb-8">
              VAIOT operates under official licenses granted by national regulatory authorities, ensuring compliance with financial regulations and providing security for our users.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Czech National Bank</h2>
                  <p className="text-gray-600 mb-4">ČNB "Česká Národní Banka"</p>
                </div>
                <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span className="text-xs font-medium">Verified</span>
                </div>
              </div>

              <div className="mb-6 flex justify-center">
                <div className="border border-gray-200 rounded-lg p-4 w-48 h-48 flex items-center justify-center">
                  <img src="/cnb-logo.png" alt="ČNB Logo" className="w-full h-full object-contain" />
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">License Details:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 mr-2 text-investment-blue flex-shrink-0 mt-0.5" />
                    <span>Virtual Asset Service Provider License</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 mr-2 text-investment-blue flex-shrink-0 mt-0.5" />
                    <span>Authorized to provide regulated crypto services in Czech Republic</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 mr-2 text-investment-blue flex-shrink-0 mt-0.5" />
                    <span>Compliant with AML/CFT regulations</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Slovak National Bank</h2>
                  <p className="text-gray-600 mb-4">NBS "Slovenská Národná Banka"</p>
                </div>
                <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span className="text-xs font-medium">Verified</span>
                </div>
              </div>

              <div className="mb-6 flex justify-center">
                <div className="border border-gray-200 rounded-lg p-4 w-48 h-48 flex items-center justify-center">
                  <img src="/nbs-logo.png" alt="NBS Logo" className="w-full h-full object-contain" />
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">License Details:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 mr-2 text-investment-blue flex-shrink-0 mt-0.5" />
                    <span>Digital Asset Service Provider License</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 mr-2 text-investment-blue flex-shrink-0 mt-0.5" />
                    <span>Authorized to provide regulated financial services in Slovakia</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 mr-2 text-investment-blue flex-shrink-0 mt-0.5" />
                    <span>Compliant with European regulatory frameworks</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-semibold mb-4">What Our Licenses Mean For You</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-3 text-investment-blue">Security</h3>
                <p className="text-gray-700">Your assets and data are protected according to the highest regulatory standards in the European Union.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-3 text-investment-blue">Transparency</h3>
                <p className="text-gray-700">All our operations are transparent and regularly audited by national financial authorities.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-3 text-investment-blue">Compliance</h3>
                <p className="text-gray-700">We adhere to strict AML and KYC procedures, ensuring a safe and compliant trading environment.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Licenses;
