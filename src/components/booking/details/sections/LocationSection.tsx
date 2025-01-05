import React from 'react';

interface LocationSectionProps {
  pickupCity: string;
  deliveryCity: string;
  weight: number;
  trackingNumber: string;
}

export function LocationSection({
  pickupCity,
  deliveryCity,
  weight,
  trackingNumber
}: LocationSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-gray-500">Ville de collecte</p>
        <p className="font-medium">{pickupCity}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Ville de livraison</p>
        <p className="font-medium">{deliveryCity}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Poids</p>
        <p className="font-medium">{weight} kg</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Numéro de suivi</p>
        <p className="font-medium">{trackingNumber}</p>
      </div>
    </div>
  );
}