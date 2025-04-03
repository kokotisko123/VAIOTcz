
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const LegalDisclaimer = () => {
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
          <h1 className="text-3xl md:text-4xl font-bold">Legal Disclaimer</h1>
        </div>
        
        <div className="prose max-w-none">
          <p className="mb-4">Last updated: April 3, 2025</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">General Disclaimer</h2>
          <p>The information provided on VAIOT's website does not constitute investment advice, financial advice, trading advice, or any other sort of advice, and you should not treat any of the website's content as such. VAIOT does not recommend that any cryptocurrency should be bought, sold, or held by you. Do conduct your own due diligence and consult your financial advisor before making any investment decisions.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Risk Warning</h2>
          <p>Cryptocurrency investments are volatile and high-risk in nature. The value of your investment may go down or up, and you may not get back the amount invested. You are solely responsible for your investment decisions and VAIOT is not liable for any losses you may incur.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Token Information</h2>
          <p>VAIOT offers a portfolio of AI-powered Legal Technology and Decentralized Law solutions integrated with AI Multi-Agents and blockchain. These solutions provide businesses and consumers with automated legal support and contracts —faster, easier, and more affordable.</p>
          
          <p>The VAIOT token is an essential part of our ecosystem and may be used for:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Accessing premium features within the VAIOT platform</li>
            <li>Participating in decentralized governance of the platform</li>
            <li>Staking to earn passive income</li>
            <li>Payment for services within the ecosystem</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">No Guarantees</h2>
          <p>VAIOT makes no representations or warranties about the accuracy or completeness of the information contained on this website. Any reliance you place on such information is therefore strictly at your own risk.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Third-Party Links</h2>
          <p>Our website may contain links to third-party websites or services that are not owned or controlled by VAIOT. VAIOT has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You further acknowledge and agree that VAIOT shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Regulatory Compliance</h2>
          <p>VAIOT strives to comply with all applicable laws and regulations in various jurisdictions. However, cryptocurrency regulations are evolving rapidly, and VAIOT may not be available in certain jurisdictions due to regulatory restrictions. You are responsible for complying with the laws and regulations of your jurisdiction when accessing our services.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to This Disclaimer</h2>
          <p>We may update our Legal Disclaimer from time to time. We will notify you of any changes by posting the new Legal Disclaimer on this page. You are advised to review this Legal Disclaimer periodically for any changes.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LegalDisclaimer;
