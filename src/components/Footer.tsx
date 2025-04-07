import React from "react";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Github,
  Shield,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-investment-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-4">
              <Link to="/" className="hover:text-gray-300 transition-colors">
                VAIOT
              </Link>
            </h3>
            <p className="text-gray-300 mb-4">
              AI-powered Legal Technology and Decentralized Law solutions
              integrated with AI Multi-Agents and blockchain. Faster, easier,
              and more affordable legal support.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/vaiotltd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/VAIOT_LTD"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/company/vaiot/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/vaiot_ltd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/VAIOT"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <a
                  href="/#features"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="/#how-it-works"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="/#partners"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Partners
                </a>
              </li>
              <li>
                <a
                  href="/#staking"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Staking
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/faq"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <a
                  href="https://vaiot.ai/assets/files/VAIOT_Whitepaper.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Whitepaper
                </a>
              </li>
              <li>
                <a
                  href="https://api.vaiot.ai/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  API Reference
                </a>
              </li>
              <li>
                <Link
                  to="/legal-disclaimer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Token Info
                </Link>
              </li>
              <li>
                <Link
                  to="/licenses"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <Shield className="mr-1 h-4 w-4" />
                  Licenses
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/legal-disclaimer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Legal Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Licenses and Verification Section */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <Shield className="mr-2 h-5 w-5 text-investment-accent" />
                Licensed and Regulated
              </h4>
              <p className="text-gray-300 mb-4">
                VAIOT is officially licensed and regulated by ČNB "Česká Národní
                Banka" and NBS "Slovenská Národná Banka".
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-6">
              {/* ČNB Logo */}
              <div className="flex flex-col items-center">
                <div className="bg-white p-2 rounded-lg mb-2 w-24 h-24 flex items-center justify-center">
                  <img
                    src="/cnb-logo.png"
                    alt="ČNB Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex items-center text-xs text-investment-accent">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </div>
              </div>

              {/* NBS Logo */}
              <div className="flex flex-col items-center">
                <div className="bg-white p-2 rounded-lg mb-2 w-24 h-24 flex items-center justify-center">
                  <img
                    src="/nbs-logo.png"
                    alt="NBS Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex items-center text-xs text-investment-accent">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 VAIOT. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/privacy-policy"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="/terms-of-service"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms
              </Link>
              <Link
                to="/licenses"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Licenses
              </Link>
              <a
                href="mailto:contact@vaiot.ai"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            <p>
              VAIOT offers a portfolio of AI-powered Legal Technology and
              Decentralized Law solutions integrated with AI Multi-Agents and
              blockchain. These solutions provide businesses and consumers with
              automated legal support and contracts —faster, easier, and more
              affordable.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
