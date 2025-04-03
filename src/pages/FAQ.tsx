
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
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
          <h1 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-medium">
                What is VAIOT?
              </AccordionTrigger>
              <AccordionContent>
                VAIOT is a company that offers AI-powered Legal Technology and Decentralized Law solutions integrated with AI Multi-Agents and blockchain. Our solutions provide businesses and consumers with automated legal support and contracts that are faster, easier, and more affordable.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-medium">
                How do I invest in VAIOT tokens?
              </AccordionTrigger>
              <AccordionContent>
                You can invest in VAIOT tokens by following the steps outlined in our "How It Works" section. Connect your wallet, convert your currency, and complete the transaction by sending ETH to the provided address. Once verified, the VAIOT tokens will be sent to your wallet.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-medium">
                What are the benefits of VAIOT tokens?
              </AccordionTrigger>
              <AccordionContent>
                VAIOT tokens allow you to participate in the VAIOT ecosystem, access premium features, stake for passive income, and potentially benefit from the growth of the platform. Token holders also get exclusive access to new features and governance rights.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-medium">
                What wallets are supported for investing?
              </AccordionTrigger>
              <AccordionContent>
                We support a variety of popular cryptocurrency wallets including MetaMask, WalletConnect, Trust Wallet, and Exodus. You can connect any of these wallets to start the investment process.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-medium">
                How does staking work?
              </AccordionTrigger>
              <AccordionContent>
                Staking allows you to earn passive income by locking your VAIOT tokens for a specified period. Our platform offers competitive APY rates, with higher rates for longer staking periods. Staking is only available after you've completed an investment in VAIOT tokens.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger className="text-lg font-medium">
                How long does it take to receive my VAIOT tokens?
              </AccordionTrigger>
              <AccordionContent>
                After completing your purchase and sending ETH to the provided address, your transaction will be processed. The verification process typically takes between 10-30 minutes, depending on network congestion. Once verified, your VAIOT tokens will be released to your crypto wallet.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7">
              <AccordionTrigger className="text-lg font-medium">
                Is there a minimum investment amount?
              </AccordionTrigger>
              <AccordionContent>
                Yes, there is a minimum investment amount to ensure efficient processing. The current minimum investment is equivalent to €100. You can convert this to the corresponding amount of ETH on our platform during the investment process.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-8">
              <AccordionTrigger className="text-lg font-medium">
                Where can I view the whitepaper?
              </AccordionTrigger>
              <AccordionContent>
                You can download our whitepaper directly from our website. The whitepaper contains detailed information about our technology, token economics, roadmap, and team. You'll find the download link in the footer of our website or in the Resources section.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-9">
              <AccordionTrigger className="text-lg font-medium">
                How can I contact support?
              </AccordionTrigger>
              <AccordionContent>
                If you have any questions or need assistance, you can reach our support team by sending an email to support@vaiot.ai. Our team is available 24/7 to help you with any issues related to your investment, tokens, or our platform.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-10">
              <AccordionTrigger className="text-lg font-medium">
                What blockchain does VAIOT use?
              </AccordionTrigger>
              <AccordionContent>
                VAIOT is built on Ethereum, one of the most widely used and secure blockchain networks. This ensures compatibility with a wide range of wallets and exchanges, as well as providing robust security for your tokens.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
