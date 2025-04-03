
import React from 'react';
import { Button } from '../ui/button';
import { RefreshCw } from 'lucide-react';

interface ConvertCurrencyProps {
  isConnected: boolean;
  selectedWallet: string;
  eurAmount: string;
  setEurAmount: (value: string) => void;
  vaiotTokens: string;
  prices: any;
  onPrevStep: () => void;
  onNextStep: () => void;
  setIsConnected: (value: boolean) => void;
}

const ConvertCurrency: React.FC<ConvertCurrencyProps> = ({
  isConnected,
  selectedWallet,
  eurAmount,
  setEurAmount,
  vaiotTokens,
  prices,
  onPrevStep,
  onNextStep,
  setIsConnected
}) => {
  return (
    <div className="flex flex-col items-center py-6">
      <div className="mb-8 w-full max-w-lg">
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          {isConnected && (
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Connected with {selectedWallet}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsConnected(false)}>Disconnect</Button>
            </div>
          )}
          
          {prices ? (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Current Rates:</span>
                <span className="text-gray-700">1 ETH = €{prices.ethereum.eur.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">VAIOT Token:</span>
                <span className="text-gray-700">€{prices.vaiot.eur.toFixed(4)}</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center my-2">
              <RefreshCw className="text-gray-400 animate-spin" />
            </div>
          )}
          
          <div className="mb-6">
            <label htmlFor="eurAmount" className="block text-sm font-medium text-gray-700 mb-1">Amount in EUR</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">€</span>
              </div>
              <input
                type="text"
                name="eurAmount"
                id="eurAmount"
                className="focus:ring-investment-blue focus:border-investment-blue block w-full pl-8 pr-12 sm:text-sm border-gray-300 rounded-md py-3"
                placeholder="0.00"
                value={eurAmount}
                onChange={(e) => setEurAmount(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-center my-4">
            <RefreshCw className={`text-gray-400 ${!prices ? 'animate-spin' : 'animate-pulse-subtle'}`} />
          </div>
          
          <div>
            <label htmlFor="vaiotAmount" className="block text-sm font-medium text-gray-700 mb-1">Equivalent in VAIOT Tokens</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                name="vaiotAmount"
                id="vaiotAmount"
                className="focus:ring-investment-blue focus:border-investment-blue block w-full pr-12 sm:text-sm border-gray-300 rounded-md py-3 bg-gray-100"
                value={vaiotTokens}
                readOnly
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">VAIOT</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Exchange Rate</span>
              <span className="text-gray-700">1 VAIOT = {prices ? `€${prices.vaiot.eur.toFixed(4)}` : 'Loading...'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Last Updated</span>
              <span className="text-gray-700">{prices ? 'Just now' : 'Loading...'}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          variant="outline"
          onClick={onPrevStep}
        >
          Back
        </Button>
        <Button 
          className="btn-primary"
          onClick={onNextStep}
          disabled={!prices}
        >
          Proceed to Transaction
        </Button>
      </div>
    </div>
  );
};

export default ConvertCurrency;
