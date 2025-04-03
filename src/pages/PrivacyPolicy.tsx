
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex items-center mb-6">
          <Link to="/">
            <Button variant="outline" className="mr-4 flex items-center gap-2">
              <Home size={16} />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
        </div>
        
        <div className="prose max-w-none">
          <p className="mb-4">Last updated: April 3, 2025</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>VAIOT ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
          <p>We may collect information about you in a variety of ways. The information we may collect via the Service includes:</p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Personal Data</h3>
          <p>Personally identifiable information, such as your name, email address, and telephone number, that you voluntarily give to us when you register with the Service or when you choose to participate in various activities related to the Service.</p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Derivative Data</h3>
          <p>Information our servers automatically collect when you access the Service, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the Service.</p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">2.3 Financial Data</h3>
          <p>Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services. We store only very limited financial information that we collect. Otherwise, all financial information is stored by our payment processor.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
          <p>We use personal information collected via our Service for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Sharing Information</h2>
          <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">4.1 By Law or to Protect Rights</h3>
          <p>If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Cookies and Web Beacons</h2>
          <p>We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Service to help customize the Service and improve your experience.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact Us</h2>
          <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
          <address className="not-italic">
            VAIOT Ltd<br />
            Email: privacy@vaiot.ai<br />
          </address>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
