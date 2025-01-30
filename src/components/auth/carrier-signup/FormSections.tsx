import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { CompanyInfoFields } from "./CompanyInfoFields";
import { ContactInfoFields } from "./ContactInfoFields";
import { ServiceOptions } from "../ServiceOptions";
import { CoverageAreaSelect } from "../CoverageAreaSelect";
import { TermsCheckboxes } from "./TermsCheckboxes";
import { AvatarUpload } from "./AvatarUpload";
import { motion, AnimatePresence } from "framer-motion";

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

export function FormSections({ form, currentStep }) {
  const renderStepContent = (step: number) => {
    switch (step) {
      case 1:
        return (
          <Card className="p-6 md:p-8">
            <ContactInfoFields form={form} />
          </Card>
        );
      case 2:
        return (
          <Card className="p-6 md:p-8">
            <PersonalInfoFields form={form} />
          </Card>
        );
      case 3:
        return (
          <Card className="p-6 md:p-8">
            <CompanyInfoFields form={form} />
          </Card>
        );
      case 4:
        return (
          <Card className="p-6 md:p-8">
            <CoverageAreaSelect form={form} />
          </Card>
        );
      case 5:
        return (
          <Card className="p-6 md:p-8">
            <ServiceOptions form={form} />
          </Card>
        );
      case 6:
        return (
          <div className="space-y-6">
            <Card className="p-6 md:p-8">
              <AvatarUpload form={form} />
            </Card>
            <Card className="p-6 md:p-8">
              <TermsCheckboxes form={form} />
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={currentStep}
        custom={currentStep}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 }
        }}
      >
        {renderStepContent(currentStep)}
      </motion.div>
    </AnimatePresence>
  );
}