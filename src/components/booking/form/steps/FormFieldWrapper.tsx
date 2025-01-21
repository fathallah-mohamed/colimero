import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";
import { BookingFormData } from "../schema";

interface FormFieldWrapperProps {
  form: UseFormReturn<BookingFormData>;
  name: keyof BookingFormData;
  label: string;
  children: ReactNode | ((field: any) => ReactNode);
}

export function FormFieldWrapper({ form, name, label, children }: FormFieldWrapperProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {typeof children === 'function' ? children(field) : children}
          </FormControl>
        </FormItem>
      )}
    />
  );
}