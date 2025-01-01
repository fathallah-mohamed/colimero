import React from 'react';

interface BookingInfoProps {
  delivery_city: string;
  recipient_name: string;
  recipient_phone: string;
}

export function BookingInfo({ delivery_city, recipient_name, recipient_phone }: BookingInfoProps) {
  return (
    <div className="mt-4">
      <p className="text-gray-600">{delivery_city}</p>
      <p className="font-medium">{recipient_name}</p>
      <p className="text-gray-600">{recipient_phone}</p>
    </div>
  );
}