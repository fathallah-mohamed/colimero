import { useState } from "react";
import { AuthDialog } from "@/components/auth/AuthDialog";
import CarrierSignupForm from "@/components/auth/carrier-signup/CarrierSignupForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

export function AuthDialogs({
  showAuthDialog,
  setShowAuthDialog,
  showRegisterForm,
  setShowRegisterForm,
  showCarrierSignupForm,
  setShowCarrierSignupForm,
}) {
  const navigate = useNavigate();

  return (
    <>
      <AuthDialog 
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onSuccess={() => setShowAuthDialog(false)}
        onRegisterClick={() => {
          setShowAuthDialog(false);
          navigate('/creer-compte');
        }}
        onCarrierRegisterClick={() => {
          setShowAuthDialog(false);
          setShowCarrierSignupForm(true);
        }}
      />

      <Dialog open={showCarrierSignupForm} onOpenChange={setShowCarrierSignupForm}>
        <DialogContent className="max-w-2xl">
          <CarrierSignupForm onSuccess={() => {
            setShowCarrierSignupForm(false);
          }} />
        </DialogContent>
      </Dialog>
    </>
  );
}