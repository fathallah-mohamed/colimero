import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { CompanyInfoFields } from "./CompanyInfoFields";
import { ContactInfoFields } from "./ContactInfoFields";
import { ServiceOptions } from "../ServiceOptions";
import { CoverageAreaSelect } from "../CoverageAreaSelect";
import { TermsCheckboxes } from "./TermsCheckboxes";
import { AvatarUpload } from "./AvatarUpload";
import { motion } from "framer-motion";
import { User, Building2, Phone, Map, Camera, Truck, Shield } from "lucide-react";

interface FormSectionsProps {
  form: any;
  currentStep: number;
}

const slideAnimation = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export function FormSections({ form, currentStep }: FormSectionsProps) {
  const renderStep = () => {
    const content = (() => {
      switch (currentStep) {
        case 1:
          return (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b pb-4 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold">Contact</h2>
              </div>
              <ContactInfoFields form={form} />
            </div>
          );

        case 2:
          return (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b pb-4 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold">Identité</h2>
              </div>
              <PersonalInfoFields form={form} />
            </div>
          );

        case 3:
          return (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b pb-4 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Building2 className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold">Entreprise</h2>
              </div>
              <CompanyInfoFields form={form} />
            </div>
          );

        case 4:
          return (
            <>
              <Card className="p-6 mb-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b pb-4 mb-6">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Map className="w-6 h-6 text-amber-600" />
                    </div>
                    <h2 className="text-xl font-semibold">Zone de couverture</h2>
                  </div>
                  <CoverageAreaSelect form={form} />
                </div>
              </Card>

              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b pb-4 mb-6">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Truck className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h2 className="text-xl font-semibold">Services proposés</h2>
                  </div>
                  <ServiceOptions form={form} />
                </div>
              </Card>
            </>
          );

        case 5:
          return (
            <>
              <Card className="p-6 mb-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b pb-4 mb-6">
                    <div className="p-2 bg-rose-100 rounded-lg">
                      <Camera className="w-6 h-6 text-rose-600" />
                    </div>
                    <h2 className="text-xl font-semibold">Photo de profil</h2>
                  </div>
                  <AvatarUpload form={form} />
                </div>
              </Card>

              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b pb-4 mb-6">
                    <div className="p-2 bg-teal-100 rounded-lg">
                      <Shield className="w-6 h-6 text-teal-600" />
                    </div>
                    <h2 className="text-xl font-semibold">Conditions et engagements</h2>
                  </div>
                  <TermsCheckboxes form={form} />
                </div>
              </Card>
            </>
          );

        default:
          return null;
      }
    })();

    return (
      <motion.div
        key={currentStep}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={slideAnimation}
        transition={{ type: "tween", duration: 0.3 }}
      >
        {content}
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {renderStep()}
    </div>
  );
}