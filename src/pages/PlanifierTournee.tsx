import { useState } from "react";
import Navigation from "@/components/Navigation";
import CarrierAuthDialog from "@/components/auth/CarrierAuthDialog";
import AccessDeniedMessage from "@/components/AccessDeniedMessage";

export default function PlanifierTournee() {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showAccessDeniedDialog, setShowAccessDeniedDialog] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <CarrierAuthDialog
        open={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
      />

      <AccessDeniedMessage
        userType="client"
        open={showAccessDeniedDialog}
        onClose={() => setShowAccessDeniedDialog(false)}
      />
    </div>
  );
}