import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { LoginFormValues } from "../types";

interface LoginFormInputsProps {
  form: UseFormReturn<LoginFormValues>;
  isLoading: boolean;
}

export function LoginFormInputs({ form, isLoading }: LoginFormInputsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                placeholder="votre@email.com"
                {...field}
                disabled={isLoading}
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
            <FormLabel>Mot de passe</FormLabel>
            <FormControl>
              <Input
                type="password"
                {...field}
                disabled={isLoading}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}