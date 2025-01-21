import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { BookingFormData } from "../schema";
import { BookingWeightSelector } from "../../BookingWeightSelector";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface PackageStepProps {
  form: UseFormReturn<BookingFormData>;
  weight: number;
  onWeightChange: (increment: boolean) => void;
  contentTypes: string[];
  onContentTypeToggle: (type: string) => void;
  specialItems: string[];
  onSpecialItemToggle: (item: string) => void;
  itemQuantities: Record<string, number>;
  onQuantityChange: (itemName: string, increment: boolean) => void;
  photos: File[];
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const availableContentTypes = [
  "Vêtements",
  "Chaussures",
  "Jouets",
  "Livres",
  "Cosmétiques",
  "Accessoires",
  "Electronique",
  "Produits alimentaires",
  "Médicaments",
  "Documents"
];

const specialItemsList = [
  { name: "Vélo", price: 50 },
  { name: "Trottinette", price: 30 },
  { name: "Télévision", price: 80 },
  { name: "Meuble", price: 100 },
  { name: "Instrument de musique", price: 70 },
  { name: "Équipement sportif", price: 40 }
];

export function PackageStep({
  form,
  weight,
  onWeightChange,
  contentTypes,
  onContentTypeToggle,
  specialItems,
  onSpecialItemToggle,
  itemQuantities,
  onQuantityChange,
  photos,
  onPhotoUpload
}: PackageStepProps) {
  const totalPrice = weight * 10 + specialItems.reduce((total, item) => {
    const specialItem = specialItemsList.find(si => si.name === item);
    return total + (specialItem?.price || 0) * (itemQuantities[item] || 1);
  }, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-semibold">Informations du colis</h2>
      
      <FormField
        control={form.control}
        name="item_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de colis</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Carton, valise..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <BookingWeightSelector
        weight={weight}
        onWeightChange={onWeightChange}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Contenu (choix multiples)</h3>
        <div className="grid grid-cols-2 gap-4">
          {availableContentTypes.map((type) => (
            <Card 
              key={type}
              className={`p-4 cursor-pointer transition-colors ${
                contentTypes.includes(type) 
                  ? "bg-blue-50 border-blue-200" 
                  : "hover:bg-gray-50"
              }`}
              onClick={() => onContentTypeToggle(type)}
            >
              <div className="flex items-center gap-2">
                <Checkbox 
                  checked={contentTypes.includes(type)}
                  onCheckedChange={() => onContentTypeToggle(type)}
                />
                <Label className="cursor-pointer">{type}</Label>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Objets spéciaux (choix multiples)</h3>
        <div className="grid grid-cols-3 gap-4">
          {specialItemsList.map((item) => (
            <Card 
              key={item.name}
              className={`p-4 cursor-pointer transition-colors ${
                specialItems.includes(item.name) 
                  ? "bg-blue-50 border-blue-200" 
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={specialItems.includes(item.name)}
                    onCheckedChange={() => onSpecialItemToggle(item.name)}
                  />
                  <Label className="cursor-pointer">{item.name}</Label>
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {item.price}€
                </div>
                {specialItems.includes(item.name) && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center"
                      onClick={() => onQuantityChange(item.name, false)}
                    >
                      -
                    </button>
                    <span className="w-8 text-center">
                      {itemQuantities[item.name] || 1}
                    </span>
                    <button
                      type="button"
                      className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center"
                      onClick={() => onQuantityChange(item.name, true)}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <FormField
        control={form.control}
        name="package_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description du colis</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Décrivez votre colis..." 
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Prix total estimé: {totalPrice.toFixed(2)}€
          <br />
          (Transport: {(weight * 10).toFixed(2)}€ + Services spéciaux: {(totalPrice - weight * 10).toFixed(2)}€)
        </AlertDescription>
      </Alert>
    </div>
  );
}