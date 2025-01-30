import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { CompanyInfoFields } from "./CompanyInfoFields";
import { ContactInfoFields } from "./ContactInfoFields";
import { ServiceOptions } from "../ServiceOptions";
import { CoverageAreaSelect } from "../CoverageAreaSelect";
import { TermsCheckboxes } from "./TermsCheckboxes";
import { AvatarUpload } from "./AvatarUpload";
import { Mail, Building2, Truck, MapPin, Shield } from "lucide-react";

export function FormSections({ form }) {
  return (
    <div className="grid gap-4">
      <Card className="p-4 md:p-6 hover:shadow-md transition-shadow">
        <ContactInfoFields form={form} />
      </Card>

      <Card className="p-4 md:p-6 hover:shadow-md transition-shadow">
        <PersonalInfoFields form={form} />
      </Card>

      <Card className="p-4 md:p-6 hover:shadow-md transition-shadow">
        <CompanyInfoFields form={form} />
      </Card>

      <Card className="p-4 md:p-6 hover:shadow-md transition-shadow">
        <CoverageAreaSelect form={form} />
      </Card>

      <Card className="p-4 md:p-6 hover:shadow-md transition-shadow">
        <TermsCheckboxes form={form} />
      </Card>
    </div>
  );
}