import React from 'react';
import { Badge } from "@/components/ui/badge";

interface SpecialItem {
  name: string;
  quantity: number;
}

interface SpecialItemsSectionProps {
  specialItems: any[];
  contentTypes: string[];
}

export function SpecialItemsSection({ specialItems, contentTypes }: SpecialItemsSectionProps) {
  // Normalisation des objets spéciaux
  const normalizedItems = React.useMemo(() => {
    if (!specialItems) return [];
    
    // Si c'est un tableau d'objets avec name et quantity
    if (Array.isArray(specialItems) && specialItems.length > 0) {
      if (typeof specialItems[0] === 'object' && 'name' in specialItems[0]) {
        return specialItems;
      }
      
      // Si c'est un tableau de strings, on ajoute une quantité par défaut
      if (typeof specialItems[0] === 'string') {
        return specialItems.map(name => ({ name, quantity: 1 }));
      }
    }
    
    // Si c'est une chaîne JSON, on essaie de la parser
    if (typeof specialItems === 'string') {
      try {
        const parsed = JSON.parse(specialItems);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error('Error parsing special items:', e);
        return [];
      }
    }
    
    return [];
  }, [specialItems]);

  console.log("Normalized special items:", normalizedItems);

  if (!normalizedItems?.length && !contentTypes?.length) return null;

  return (
    <div className="space-y-4">
      {normalizedItems?.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-2">Objets spéciaux</p>
          <div className="flex flex-wrap gap-2">
            {normalizedItems.map((item, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-2">
                <span>{item.name}</span>
                {item.quantity && (
                  <span className="text-xs bg-primary/10 px-1.5 py-0.5 rounded-full">
                    {item.quantity}
                  </span>
                )}
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