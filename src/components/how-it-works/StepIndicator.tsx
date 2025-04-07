
import React from 'react';

interface Step {
  number: number;
  title: string;
  icon: React.ReactNode;
}

interface StepIndicatorProps {
  activeStep: number;
  setActiveStep: (step: number) => void;
  steps: Step[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ activeStep, setActiveStep, steps }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="relative flex items-center justify-between w-full max-w-4xl">
        <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-1 bg-gray-200 -z-10"></div>
        
        {steps.map((step) => (
          <div key={step.number} className="relative flex flex-col items-center">
            <button
              onClick={() => setActiveStep(step.number)}
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                activeStep >= step.number
                  ? 'bg-investment-blue border-investment-blue text-white'
                  : 'bg-white border-gray-300 text-gray-500'
              } transition-colors cursor-pointer`}
              aria-label={`Go to step ${step.number}`}
            >
              {step.icon}
            </button>
            <span className={`mt-2 text-xs font-medium sm:text-sm ${
              activeStep === step.number ? 'text-investment-blue' : 'text-gray-500'
            }`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
