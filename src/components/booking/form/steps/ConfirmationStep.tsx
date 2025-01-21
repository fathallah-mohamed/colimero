import { UseFormReturn } from "react-hook-form";
import { BookingFormData } from "../schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

interface ConfirmationStepProps {
  form: UseFormReturn<BookingFormData>;
  onEdit: (step: number) => void;
  weight: number;
  specialItems: string[];
  itemQuantities: Record<string, number>;
  pricePerKg: number;
}

export function ConfirmationStep({ 
  form, 
  onEdit, 
  weight,
  specialItems,
  itemQuantities,
  pricePerKg
}: ConfirmationStepProps) {
  const formValues = form.getValues();

  const calculateTotalPrice = () => {
    const weightPrice = weight * pricePerKg;
    const specialItemsPrice = specialItems.reduce((total, item) => {
      const itemPrice = 10; // Prix fixe pour l'exemple
      const quantity = itemQuantities[item] || 1;
      return total + (itemPrice * quantity);
    }, 0);
    return weightPrice + specialItemsPrice;
  };

  const Section = ({ title, data, step }: { title: string; data: Record<string, any>; step: number }) => (
    <Card className="p-4 relative">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold">{title}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(step)}
          className="absolute top-2 right-2"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="grid grid-cols-2 gap-2">
            <span className="text-gray-600">{key}:</span>
            <span>{value || "-"}</span>
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-semibold">Confirmation de la réservation</h2>
      
      <div className="space-y-4">
        <Section
          title="Informations de l'expéditeur"
          data={{
            "Nom": formValues.sender_name,
            "Téléphone": formValues.sender_phone
          }}
          step={1}
        />

        <Section
          title="Informations du destinataire"
          data={{
            "Nom": formValues.recipient_name,
            "Téléphone": formValues.recipient_phone,
            "Adresse": formValues.recipient_address
          }}
          step={2}
        />

        <Section
          title="Informations du colis"
          data={{
            "Type": formValues.item_type,
            "Poids": `${weight} kg`,
            "Description": formValues.package_description
          }}
          step={3}
        />

        <Card className="p-4">
          <h3 className="font-semibold mb-4">Récapitulatif des coûts</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Transport ({weight} kg × {pricePerKg}€)</span>
              <span>{(weight * pricePerKg).toFixed(2)}€</span>
            </div>
            {specialItems.map(item => (
              <div key={item} className="flex justify-between">
                <span>{item} (×{itemQuantities[item] || 1})</span>
                <span>{((itemQuantities[item] || 1) * 10).toFixed(2)}€</span>
              </div>
            ))}
            <div className="border-t pt-2 font-semibold flex justify-between">
              <span>Total</span>
              <span>{calculateTotalPrice().toFixed(2)}€</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}