import React from 'react';
import { Badge } from "@/components/ui/badge";

interface SpecialItem {
  name: string;
  quantity: number;
}

interface SpecialItemsSectionProps {
  specialItems: SpecialItem[];
  contentTypes: string[];
}

export function SpecialItemsSection({ specialItems, contentTypes }: SpecialItemsSectionProps) {
  if (!specialItems?.length && !contentTypes?.length) return null;

  return (
    <div className="space-y-4">
      {specialItems?.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-2">Objets spéciaux</p>
          <div className="flex flex-wrap gap-2">
            {specialItems.map((item, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-2">
                <span>{item.name}</span>
                <span className="text-xs bg-primary/10 px-1.5 py-0.5 rounded-full">
                  {item.quantity}
                </span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {contentTypes?.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-2">Types de contenu</p>
          <div className="flex flex-wrap gap-2">
            {contentTypes.map((type, index) => (
              <Badge key={index} variant="secondary">
                {type}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}