import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface EmailVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  isResending: boolean;
  onResendEmail: () => void;
  showConfirmationDialog?: boolean;
  onConfirmationClose?: () => void;
}

export function EmailVerificationDialog({ 
  isOpen, 
  onClose, 
  email,
  isResending,
  onResendEmail,
  showConfirmationDialog = false,
  onConfirmationClose
}: EmailVerificationDialogProps) {
  const [emailInput, setEmailInput] = useState(email);

  const handleResendEmail = async () => {
    console.log('Attempting to resend activation email to:', emailInput);
    try {
      // Appeler la fonction d'envoi d'email d'activation
      const { error } = await supabase.functions.invoke('send-activation-email', {
        body: { 
          email: emailInput,
        }
      });

      if (error) {
        console.error('Error sending activation email:', error);
        return;
      }

      console.log('Activation email sent successfully');
      onResendEmail();
    } catch (error) {
      console.error('Error in handleResendEmail:', error);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) onClose();
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="bg-blue-50 p-3 rounded-full">
                <Mail className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">Compte non activé</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-center text-gray-600">
              Votre compte n'est pas encore activé. Veuillez vérifier votre boîte mail à l'adresse <span className="font-medium">{emailInput}</span> et cliquer sur le lien d'activation.
            </p>
            
            <p className="text-sm text-center text-gray-500">
              Si vous n'avez pas reçu l'email, vérifiez vos spams ou cliquez sur le bouton ci-dessous pour recevoir un nouveau lien.
            </p>

            <div className="space-y-4">
              <Button 
                onClick={handleResendEmail} 
                variant="outline" 
                className="w-full"
                disabled={isResending}
              >
                {isResending ? "Envoi en cours..." : "Renvoyer l'email d'activation"}
              </Button>
              
              <Button onClick={onClose} className="w-full">
                Fermer
              </Button>
            </div>

            <p className="text-sm text-gray-500 text-center">
              Le lien d'activation est valable pendant 48 heures
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmationDialog} onOpenChange={onConfirmationClose}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <AlertDialogTitle className="text-center">Email envoyé avec succès</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Un nouveau lien d'activation a été envoyé à votre adresse email. Veuillez vérifier votre boîte de réception.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-center mt-4">
            <Button onClick={onConfirmationClose} variant="default">
              Fermer
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}