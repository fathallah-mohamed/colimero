import { FC } from 'react';
import { ServiceIcon } from './ServiceIcon';

interface ServiceItemProps {
  service: {
    service_type: string;
    icon: string;
  };
}

const serviceLabels: Record<string, string> = {
  'livraison_express': 'Livraison Express',
  'livraison_domicile': 'Livraison à domicile',
  'transport_standard': 'Transport de colis standard',
  'transport_volumineux': 'Transport d\'objets volumineux',
  'collecte_programmee': 'Collecte programmée'
};

export const ServiceItem: FC<ServiceItemProps> = ({ service }) => (
  <div className="flex items-center gap-3">
    <ServiceIcon icon={service.icon} serviceType={service.service_type} />
    <span className="text-gray-700">
      {serviceLabels[service.service_type] || service.service_type}
    </span>
  </div>
);