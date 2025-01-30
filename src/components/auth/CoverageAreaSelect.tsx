import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";

const countryOptions = [
  { id: "TN", label: "Tunisie" },
  { id: "MA", label: "Maroc" },
  { id: "DZ", label: "Algérie" },
];

interface CoverageAreaSelectProps {
  form: UseFormReturn<any>;
}

export function CoverageAreaSelect({ form }: CoverageAreaSelectProps) {
  return (
    <FormField
      control={form.control}
      name="coverage_area"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base">Zone de couverture</FormLabel>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-blue-700 font-medium">France (obligatoire)</span>
            </div>
            
            <FormLabel className="text-sm">Sélectionnez un pays du Maghreb :</FormLabel>
            <RadioGroup
              onValueChange={(value) => {
                field.onChange(['FR', value]);
              }}
              value={field.value?.[1] || ""}
              className="grid grid-cols-1 gap-3"
            >
              {countryOptions.map((country, index) => (
                <motion.div
                  key={country.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="relative overflow-hidden transition-all hover:shadow-md"
                  >
                    <label 
                      htmlFor={country.id}
                      className="flex items-center p-4 cursor-pointer"
                    >
                      <RadioGroupItem value={country.id} id={country.id} className="mr-4" />
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-500" />
                        <span className="font-medium">{country.label}</span>
                      </div>
                    </label>
                  </Card>
                </motion.div>
              ))}
            </RadioGroup>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}