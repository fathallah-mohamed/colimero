import React from 'react';

interface SenderRecipientSectionProps {
  senderName: string | null;
  senderPhone: string | null;
  senderEmail?: string | null;
  recipientName: string;
  recipientPhone: string;
  recipientEmail?: string | null;
  recipientAddress: string;
}

export function SenderRecipientSection({
  senderName,
  senderPhone,
  senderEmail,
  recipientName,
  recipientPhone,
  recipientEmail,
  recipientAddress
}: SenderRecipientSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-gray-500">Expéditeur</p>
        <p className="font-medium">{senderName}</p>
        <p className="text-sm text-gray-500">{senderPhone}</p>
        {senderEmail && <p className="text-sm text-gray-500">{senderEmail}</p>}
      </div>
      <div>
        <p className="text-sm text-gray-500">Destinataire</p>
        <p className="font-medium">{recipientName}</p>
        <p className="text-sm text-gray-500">{recipientPhone}</p>
        {recipientEmail && <p className="text-sm text-gray-500">{recipientEmail}</p>}
        <p className="text-sm text-gray-500">{recipientAddress}</p>
      </div>
    </div>
  );
}