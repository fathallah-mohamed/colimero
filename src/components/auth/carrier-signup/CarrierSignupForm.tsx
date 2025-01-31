import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { formSchema, type FormValues } from "./FormSchema";
import { FormSections } from "./FormSections";
import { useCarrierRegistration } from "@/hooks/useCarrierRegistration";

interface CarrierSignupFormProps {
  onSuccess?: () => void;
}

export default function CarrierSignupForm({ onSuccess }: CarrierSignupFormProps) {
  const { isLoading, handleSubmit } = useCarrierRegistration(onSuccess);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      phone: "",
      first_name: "",
      last_name: "",
      company_name: "",
      siret: null,
      address: "",
      phone_secondary: "",
      coverage_area: ["FR"],
      total_capacity: 0,
      price_per_kg: 0,
      avatar_url: null,
      services: []
    },
  });

  const formValues = form.watch();
  const isValid = form.formState.isValid;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormSections form={form} />

        <div className="mt-8 text-center">
          <Button 
            type="submit" 
            className="w-full max-w-md button-gradient text-white py-6 text-lg font-semibold"
            disabled={!isValid || isLoading}
          >
            {isLoading ? "Envoi en cours..." : "Envoyer ma demande d'inscription"}
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Une fois votre demande envoyée, nous vous contacterons pour finaliser votre inscription.
          </p>
        </div>
      </form>
    </Form>
  );
}