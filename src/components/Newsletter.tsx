
import React from 'react';
import { Button } from './ui/button';

const Newsletter = () => {
  return (
    <section className="container-section bg-gradient-investment text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="heading-lg mb-6">Stay Informed About Market Trends</h2>
        <p className="text-lg text-gray-200 mb-8">
          Subscribe to our newsletter to receive the latest updates, exclusive market insights, and investment opportunities directly in your inbox.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <input
            type="email"
            className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-gray-900"
            placeholder="Enter your email address"
          />
          <Button className="bg-investment-accent hover:bg-amber-500 text-investment-dark font-medium px-6 py-3">
            Subscribe
          </Button>
        </div>
        
        <p className="text-sm text-gray-300 mt-4">
          By subscribing, you agree to our Privacy Policy and Terms of Service
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
