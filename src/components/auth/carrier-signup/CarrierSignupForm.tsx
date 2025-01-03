import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { CompanyInfoFields } from "./CompanyInfoFields";
import { ContactInfoFields } from "./ContactInfoFields";
import { CoverageAreaSelect } from "@/components/auth/CoverageAreaSelect";
import { ServiceOptions } from "@/components/auth/ServiceOptions";
import { TermsCheckboxes } from "./TermsCheckboxes";
import { useCarrierSignup } from "./useCarrierSignup";
import { FormSection } from "@/components/tour/form/FormSection";
import { AvatarUpload } from "./AvatarUpload";
import { CapacityFields } from "./CapacityFields";

interface CarrierSignupFormProps {
  onSuccess: () => void;
}

export default function CarrierSignupForm({ onSuccess }: CarrierSignupFormProps) {
  const { form, onSubmit } = useCarrierSignup(onSuccess);
  
  // Vérifier si tous les champs obligatoires sont remplis
  const isFormValid = form.formState.isValid;
  const allTermsAccepted = form.watch(['terms_accepted', 'customs_declaration', 'responsibility_terms_accepted'])
    .every(value => value === true);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto pb-20">
        <div className="grid gap-6">
          <FormSection title="Photo de profil" className="bg-white">
            <AvatarUpload form={form} />
          </FormSection>

          <FormSection title="Informations de contact" className="bg-white">
            <ContactInfoFields form={form} />
          </FormSection>

          <FormSection title="Informations personnelles" className="bg-white">
            <PersonalInfoFields form={form} />
          </FormSection>

          <FormSection title="Informations de l'entreprise" className="bg-white">
            <CompanyInfoFields form={form} />
          </FormSection>

          <FormSection title="Capacités de transport" className="bg-white">
            <CapacityFields form={form} />
          </FormSection>

          <FormSection title="Zones de couverture" className="bg-white">
            <CoverageAreaSelect form={form} />
          </FormSection>

          <FormSection title="Services proposés" className="bg-white">
            <ServiceOptions form={form} />
          </FormSection>

          <FormSection title="Conditions et engagements" className="bg-white">
            <TermsCheckboxes form={form} />
          </FormSection>
        </div>

        <Button 
          type="submit" 
          className="w-full mt-8"
          disabled={!isFormValid || !allTermsAccepted}
        >
          S'inscrire
        </Button>
      </form>
    </Form>
  );
}