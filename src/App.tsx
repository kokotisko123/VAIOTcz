
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import FAQ from "./pages/FAQ";
import LegalDisclaimer from "./pages/LegalDisclaimer";
import Licenses from "./pages/Licenses";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import { Toaster } from "./components/ui/toaster";
import Profile from "./pages/Profile";
import Withdrawals from "./pages/Withdrawals";
import AccountSettings from "./pages/AccountSettings";

// Component to conditionally render the navbar
const NavbarWrapper = () => {
  const location = useLocation();
  
  // Don't show the navbar on the dashboard page
  const hideNavbarOn = ["/dashboard"];
  const shouldShowNavbar = !hideNavbarOn.includes(location.pathname);
  
  return shouldShowNavbar ? <Navbar /> : null;
};

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<><Navbar /><Index /></>} />
        <Route path="/auth" element={<><Navbar /><Auth /></>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<><Navbar /><Profile /></>} />
        <Route path="/withdrawals" element={<><Navbar /><Withdrawals /></>} />
        <Route path="/account-settings" element={<><Navbar /><AccountSettings /></>} />
        <Route path="/faq" element={<><Navbar /><FAQ /></>} />
        <Route path="/legal-disclaimer" element={<><Navbar /><LegalDisclaimer /></>} />
        <Route path="/licenses" element={<><Navbar /><Licenses /></>} />
        <Route path="/privacy-policy" element={<><Navbar /><PrivacyPolicy /></>} />
        <Route path="/terms-of-service" element={<><Navbar /><TermsOfService /></>} />
        <Route path="*" element={<><Navbar /><NotFound /></>} />
      </Routes>
    </Router>
  );
}

export default App;
