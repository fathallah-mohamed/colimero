import { FC } from 'react';

interface ServiceIconProps {
  icon: string;
  serviceType: string;
}

export const ServiceIcon: FC<ServiceIconProps> = ({ icon, serviceType }) => (
  <div className="h-10 w-10 rounded-lg bg-[#E5DEFF] flex items-center justify-center">
    {icon && (
      <img
        src={`/icons/${icon}.svg`}
        alt={serviceType}
        className="h-5 w-5"
      />
    )}
  </div>
);