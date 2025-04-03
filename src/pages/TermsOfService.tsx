
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
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
          <h1 className="text-3xl md:text-4xl font-bold">Terms of Service</h1>
        </div>
        
        <div className="prose max-w-none">
          <p className="mb-4">Last updated: April 3, 2025</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Agreement to Terms</h2>
          <p>By accessing our website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials on VAIOT's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose;</li>
            <li>attempt to decompile or reverse engineer any software contained on VAIOT's website;</li>
            <li>remove any copyright or other proprietary notations from the materials; or</li>
            <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Disclaimer</h2>
          <p>The materials on VAIOT's website are provided on an 'as is' basis. VAIOT makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Limitations</h2>
          <p>In no event shall VAIOT or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on VAIOT's website, even if VAIOT or a VAIOT authorized representative has been notified orally or in writing of the possibility of such damage.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Accuracy of Materials</h2>
          <p>The materials appearing on VAIOT's website could include technical, typographical, or photographic errors. VAIOT does not warrant that any of the materials on its website are accurate, complete or current. VAIOT may make changes to the materials contained on its website at any time without notice.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Links</h2>
          <p>VAIOT has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by VAIOT of the site. Use of any such linked website is at the user's own risk.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Modifications</h2>
          <p>VAIOT may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Governing Law</h2>
          <p>These terms and conditions are governed by and construed in accordance with the laws of Malta and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
