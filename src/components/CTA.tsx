
import React, { useEffect, useRef } from "react";
import { ArrowRight, Star, Award, Users } from "lucide-react";

const CTA = () => {
  const ctaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (ctaRef.current) {
      observer.observe(ctaRef.current);
    }
    
    return () => {
      if (ctaRef.current) {
        observer.unobserve(ctaRef.current);
      }
    };
  }, []);
  
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white relative" id="get-access" ref={ctaRef}>
      {/* Trust indicators section to fill empty space */}
      <div className="container mx-auto px-4 mb-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Investors Trust VAIOT</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied investors who have already discovered the benefits of our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 text-center shadow-sm border border-gray-100">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <Users />
              </div>
              <h3 className="text-xl font-bold mb-2">10,000+</h3>
              <p className="text-gray-600">Active Investors</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 text-center shadow-sm border border-gray-100">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600 mb-4">
                <Star />
              </div>
              <h3 className="text-xl font-bold mb-2">4.8/5</h3>
              <p className="text-gray-600">Average Rating</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 text-center shadow-sm border border-gray-100">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
                <Award />
              </div>
              <h3 className="text-xl font-bold mb-2">$50M+</h3>
              <p className="text-gray-600">Total Investment</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="section-container relative z-10 opacity-0 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto glass-card p-6 sm:p-8 md:p-10 lg:p-14 text-center overflow-hidden relative">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-pulse-100/30 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-gray-100/50 rounded-full -translate-x-1/2 translate-y-1/2 blur-2xl"></div>
          
          <div className="pulse-chip mx-auto mb-4 sm:mb-6">
            <span>Limited Availability</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Be Among the First to <br className="hidden sm:inline" />
            <span className="text-pulse-500">Experience VAIOT</span>
          </h2>
          
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
            We're accepting a limited number of early adopters. Submit your application today to secure your place in the future of AI-powered legal technology.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#contact" className="button-primary group flex items-center justify-center w-full sm:w-auto">
              Request Early Access
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#" className="button-secondary w-full sm:w-auto text-center">
              Join Waitlist
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
