import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./FormSchema";

export function PersonalInfoFields({ form }: { form: UseFormReturn<FormValues> }) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="votre@email.fr" {...field} />
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
            <FormLabel>Mot de passe</FormLabel>
            <FormControl>
              <Input type="password" placeholder="Votre mot de passe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prénom</FormLabel>
            <FormControl>
              <Input placeholder="Votre prénom" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom</FormLabel>
            <FormControl>
              <Input placeholder="Votre nom" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Téléphone</FormLabel>
            <FormControl>
              <Input placeholder="+33 6 12 34 56 78" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phoneSecondary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Téléphone secondaire (optionnel)</FormLabel>
            <FormControl>
              <Input placeholder="+33 6 12 34 56 78" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}