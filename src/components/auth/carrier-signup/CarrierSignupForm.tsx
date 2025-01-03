import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { CompanyInfoFields } from "./CompanyInfoFields";
import { ContactInfoFields } from "./ContactInfoFields";
import { CoverageAreaSelect } from "@/components/auth/CoverageAreaSelect";
import { ServiceOptions } from "@/components/auth/ServiceOptions";
import { TermsCheckboxes } from "./TermsCheckboxes";
import { useCarrierSignup } from "./useCarrierSignup";

interface CarrierSignupFormProps {
  onSuccess: () => void;
}

export default function CarrierSignupForm({ onSuccess }: CarrierSignupFormProps) {
  const { form, onSubmit } = useCarrierSignup(onSuccess);
  const allTermsAccepted = form.watch(['terms_accepted', 'customs_declaration', 'responsibility_terms_accepted'])
    .every(value => value === true);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-8">
          <ContactInfoFields form={form} />
          <PersonalInfoFields form={form} />
          <CompanyInfoFields form={form} />
          <CoverageAreaSelect form={form} />
          <ServiceOptions form={form} />
          <TermsCheckboxes form={form} />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={!form.formState.isValid || !allTermsAccepted}
        >
          S'inscrire
        </Button>
      </form>
    </Form>
  );
}