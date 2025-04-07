
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, Wallet, Shield, LogIn, UserCircle, User, LogOut, Info, FileText, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from './ui/dropdown-menu';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleAuthClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };
  
  return <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-extrabold text-investment-accent text-center md:text-4xl hover:opacity-80 transition-opacity">
              VAIOT
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/#features" className="text-investment-dark hover:text-investment-blue transition-colors">Features</a>
            <a href="/#how-it-works" className="text-investment-dark hover:text-investment-blue transition-colors">How It Works</a>
            <a href="/#staking" className="text-investment-dark hover:text-investment-blue transition-colors">Staking</a>
            <Link to="/licenses" className="text-investment-dark hover:text-investment-blue transition-colors flex items-center">
              <Shield className="mr-1 h-4 w-4" />
              Licenses
            </Link>
            <div className="relative group">
              <button className="flex items-center text-investment-dark hover:text-investment-blue transition-colors">
                Resources <ChevronDown className="ml-1 h-4 w-4 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <a href="https://vaiot.ai/assets/files/VAIOT_Whitepaper.pdf" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Whitepaper</a>
                  <Link to="/faq" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">FAQ</Link>
                  <Link to="/legal-disclaimer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Token Info</Link>
                  <Link to="/licenses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Licenses</Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    className="bg-investment-blue hover:bg-blue-800 text-white flex items-center space-x-2 transform hover:scale-105 transition-all duration-200"
                  >
                    <UserCircle className="h-4 w-4" />
                    <span>My Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-medium text-gray-900">
                    My Account
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <Wallet className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile Info</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/withdrawals')}>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Withdrawal Requests</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/account-settings')} className="text-amber-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Account Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={handleAuthClick}
                className="bg-investment-blue hover:bg-blue-800 text-white flex items-center space-x-2 transform hover:scale-105 transition-all duration-200"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In / Sign Up</span>
              </Button>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-investment-blue focus:outline-none">
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="block h-6 w-6" aria-hidden="true" /> : <Menu className="block h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && <div className="md:hidden absolute w-full bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/#features" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100">Features</a>
            <a href="/#how-it-works" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100">How It Works</a>
            <a href="/#staking" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100">Staking</a>
            <Link to="/licenses" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100 flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Licenses
            </Link>
            <Link to="/faq" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100">FAQ</Link>
            <Link to="/legal-disclaimer" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100">Token Info</Link>
            
            {user && (
              <>
                <div className="border-t border-gray-200 my-2 pt-2">
                  <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100 flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile Info
                  </Link>
                  <Link to="/withdrawals" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100 flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Withdrawal Requests
                  </Link>
                  <Link to="/account-settings" className="block px-3 py-2 rounded-md text-base font-medium text-amber-600 hover:bg-gray-100 flex items-center">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Account Settings
                  </Link>
                </div>
              </>
            )}
            
            <div className="mt-4 px-3">
              {user ? (
                <>
                  <Button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full mb-2 bg-investment-blue hover:bg-blue-800 text-white flex items-center justify-center space-x-2"
                  >
                    <Wallet className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Button>
                  <Button 
                    onClick={handleSignOut}
                    variant="destructive"
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={handleAuthClick}
                  className="w-full bg-investment-blue hover:bg-blue-800 text-white flex items-center justify-center space-x-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In / Sign Up</span>
                </Button>
              )}
            </div>
          </div>
        </div>}
    </nav>;
};

export default Navbar;
