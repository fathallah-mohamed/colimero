import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { AvatarUpload } from "./AvatarUpload";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { CompanyInfoFields } from "./CompanyInfoFields";
import { ContactInfoFields } from "./ContactInfoFields";
import { ServiceOptions } from "../ServiceOptions";
import { CoverageAreaSelect } from "../CoverageAreaSelect";
import { TermsCheckboxes } from "./TermsCheckboxes";

export function FormSections({ form }) {
  return (
    <div className="grid gap-8">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Photo de profil</h2>
        <AvatarUpload form={form} />
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Informations de contact</h2>
        <ContactInfoFields form={form} />
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Informations personnelles</h2>
        <PersonalInfoFields form={form} />
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Informations de l'entreprise</h2>
        <CompanyInfoFields form={form} />
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Zone de couverture</h2>
        <CoverageAreaSelect form={form} />
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Services proposés</h2>
        <ServiceOptions form={form} />
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Conditions et engagements</h2>
        <TermsCheckboxes form={form} />
      </Card>
    </div>
  );
}