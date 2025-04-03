import React from 'react';
interface StepHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}
const StepHeader: React.FC<StepHeaderProps> = ({
  icon,
  title,
  description
}) => {
  return <div className="bg-gradient-to-r from-investment-blue to-blue-700 text-white p-6 rounded-2xl">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-white/20 rounded-full">
          {icon}
        </div>
        <h3 className="text-xl font-semibold">
          {title}
        </h3>
      </div>
      <p className="mt-2 text-gray-100">
        {description}
      </p>
    </div>;
};
export default StepHeader;