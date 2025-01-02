import { FC } from 'react';
import { ServiceItem } from './ServiceItem';

interface ServicesListProps {
  services: Array<{
    service_type: string;
    icon: string;
  }>;
}

export const ServicesList: FC<ServicesListProps> = ({ services }) => (
  <div className="space-y-4">
    {services?.map((service) => (
      <ServiceItem key={service.service_type} service={service} />
    ))}
    {(!services || services.length === 0) && (
      <p className="text-gray-500 text-center py-4">
        Aucun service sélectionné
      </p>
    )}
  </div>
);