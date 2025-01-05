import React from 'react';
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarrierSectionProps {
  carrierName: string | null | undefined;
  carrierPhone: string | null | undefined;
  carrierAvatar: string | null | undefined;
}

export function CarrierSection({ carrierName, carrierPhone, carrierAvatar }: CarrierSectionProps) {
  const handlePhoneClick = () => {
    if (carrierPhone) {
      window.location.href = `tel:${carrierPhone}`;
    }
  };

  return (
    <div>
      <p className="text-sm text-gray-500 mb-2">Transporteur</p>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {carrierAvatar && (
            <img 
              src={carrierAvatar} 
              alt="Avatar du transporteur"
              className="w-8 h-8 rounded-full"
            />
          )}
          <p className="font-medium">{carrierName || "Non assigné"}</p>
        </div>
        {carrierPhone && (
          <Button
            variant="outline"
            size="sm"
            onClick={handlePhoneClick}
            className="flex items-center gap-2"
          >
            <Phone className="h-4 w-4" />
            {carrierPhone}
          </Button>
        )}
      </div>
    </div>
  );
}