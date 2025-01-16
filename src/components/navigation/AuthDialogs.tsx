import { useState } from "react";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { RegisterForm } from "@/components/auth/RegisterForm";
import CarrierSignupForm from "@/components/auth/carrier-signup/CarrierSignupForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function AuthDialogs({
  showAuthDialog,
  setShowAuthDialog,
  showRegisterForm,
  setShowRegisterForm,
  showCarrierSignupForm,
  setShowCarrierSignupForm,
}) {
  return (
    <>
      <AuthDialog 
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onSuccess={() => setShowAuthDialog(false)}
        onRegisterClick={() => {
          setShowAuthDialog(false);
          setShowRegisterForm(true);
        }}
        onCarrierRegisterClick={() => {
          setShowAuthDialog(false);
          setShowCarrierSignupForm(true);
        }}
      />

      <Dialog open={showRegisterForm} onOpenChange={setShowRegisterForm}>
        <DialogContent className="max-w-2xl">
          <RegisterForm onLogin={() => {
            setShowRegisterForm(false);
            setShowAuthDialog(true);
          }} />
        </DialogContent>
      </Dialog>

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