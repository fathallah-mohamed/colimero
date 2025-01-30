import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { CompanyInfoFields } from "./CompanyInfoFields";
import { ContactInfoFields } from "./ContactInfoFields";
import { ServiceOptions } from "../ServiceOptions";
import { CoverageAreaSelect } from "../CoverageAreaSelect";
import { TermsCheckboxes } from "./TermsCheckboxes";
import { AvatarUpload } from "./AvatarUpload";
import { MapPin, Mail, Building2, Truck, Shield } from "lucide-react";

export function FormSections({ form }) {
  return (
    <div className="grid gap-6">
      <Card className="p-4 md:p-6 hover:shadow-md transition-shadow">
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b pb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold">Contact</h2>
          </div>
          <ContactInfoFields form={form} />
        </div>
      </Card>

      <Card className="p-4 md:p-6 hover:shadow-md transition-shadow">
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b pb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Building2 className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold">Informations personnelles</h2>
          </div>
          <PersonalInfoFields form={form} />
        </div>
      </Card>

      <Card className="p-4 md:p-6 hover:shadow-md transition-shadow">
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b pb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Truck className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold">Entreprise</h2>
          </div>
          <CompanyInfoFields form={form} />
        </div>
      </Card>

      <Card className="p-4 md:p-6 hover:shadow-md transition-shadow">
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b pb-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <MapPin className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-lg font-semibold">Zone de couverture</h2>
          </div>
          <CoverageAreaSelect form={form} />
        </div>
      </Card>

      <Card className="p-4 md:p-6 hover:shadow-md transition-shadow">
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b pb-3">
            <div className="p-2 bg-rose-100 rounded-lg">
              <Shield className="w-5 h-5 text-rose-600" />
            </div>
            <h2 className="text-lg font-semibold">Conditions et engagements</h2>
          </div>
          <TermsCheckboxes form={form} />
        </div>
      </Card>
    </div>
  );
}