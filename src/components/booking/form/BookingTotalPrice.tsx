import { Button } from "@/components/ui/button";

interface BookingTotalPriceProps {
  weight: number;
  pricePerKg: number;
  selectedSpecialItems: string[];
  itemQuantities: Record<string, number>;
  specialItems: Array<{ name: string; price: number }>;
  isLoading: boolean;
  disabled: boolean;
}

export function BookingTotalPrice({
  weight,
  pricePerKg,
  selectedSpecialItems,
  itemQuantities,
  specialItems,
  isLoading,
  disabled
}: BookingTotalPriceProps) {
  const calculateTotalPrice = () => {
    const weightPrice = weight * pricePerKg;
    const specialItemsPrice = selectedSpecialItems.reduce((total, item) => {
      const itemPrice = specialItems.find(i => i.name === item)?.price || 0;
      const quantity = itemQuantities[item] || 1;
      return total + (itemPrice * quantity);
    }, 0);

    return weightPrice + specialItemsPrice;
  };

  return (
    <Button 
      type="submit" 
      className="w-full bg-blue-400 hover:bg-blue-500"
      disabled={isLoading || disabled}
    >
      Confirmer la réservation ({calculateTotalPrice().toFixed(2)}€)
    </Button>
  );
}