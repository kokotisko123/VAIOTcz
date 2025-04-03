
import React from 'react';
import { Wallet, RefreshCw, SendHorizonal } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface StepIndicatorProps {
  activeStep: number;
  setActiveStep: (step: number) => void;
  steps: Step[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ activeStep, setActiveStep, steps }) => {
  return (
    <div className="flex justify-center mb-12">
      <div className="relative flex items-center max-w-3xl w-full">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            {/* Step Circle */}
            <div 
              className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500 ${
                activeStep >= step.number 
                  ? 'bg-investment-blue border-investment-blue text-white' 
                  : 'bg-white border-gray-300 text-gray-500'
              }`}
              onClick={() => setActiveStep(step.number)}
            >
              {step.number}
            </div>
            
            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2">
                <div 
                  className="h-full transition-all duration-500" 
                  style={{
                    background: `linear-gradient(to right, ${activeStep > step.number ? '#1A365D' : '#E2E8F0'} 50%, ${activeStep > step.number + 1 ? '#1A365D' : '#E2E8F0'} 50%)`,
                  }}
                ></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
