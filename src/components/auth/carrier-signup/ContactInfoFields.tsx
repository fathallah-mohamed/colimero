import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import type { CarrierSignupFormValues } from "./FormSchema";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";

interface ContactInfoFieldsProps {
  form: UseFormReturn<CarrierSignupFormValues>;
}

export function ContactInfoFields({ form }: ContactInfoFieldsProps) {
  const password = form.watch("password");

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informations de contact</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="votre@email.com" 
                  {...field} 
                  onBlur={(e) => {
                    field.onBlur();
                    form.trigger("email");
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Mot de passe <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="********" 
                  {...field}
                  onBlur={(e) => {
                    field.onBlur();
                    form.trigger("password");
                  }}
                />
              </FormControl>
              <PasswordStrengthIndicator password={password} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Téléphone principal <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="+33 6 XX XX XX XX" 
                  {...field}
                  onBlur={(e) => {
                    field.onBlur();
                    form.trigger("phone");
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone_secondary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone secondaire (optionnel)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="+33 6 XX XX XX XX" 
                  {...field}
                  onBlur={(e) => {
                    field.onBlur();
                    form.trigger("phone_secondary");
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}