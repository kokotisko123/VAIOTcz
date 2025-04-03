
import React from "react";
import { Loader } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 24, 
  color = "currentColor" 
}) => {
  return (
    <div className="inline-flex items-center justify-center">
      <Loader 
        size={size} 
        className="animate-spin text-primary" 
        color={color}
      />
    </div>
  );
};

export default LoadingSpinner;
