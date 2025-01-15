import { Button } from "@/components/ui/button";
import { RegisterFormFields } from "./register/RegisterFormFields";
import { useRegisterForm } from "./register/useRegisterForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface RegisterFormProps {
  onLogin: () => void;
}

export function RegisterForm({ onLogin }: RegisterFormProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState<{
    title: string;
    description: string;
  }>({
    title: "",
    description: ""
  });

  const handleSuccess = (type: 'new' | 'existing') => {
    if (type === 'new') {
      setDialogContent({
        title: "Compte créé avec succès",
        description: "Un email d'activation a été envoyé à votre adresse email. Veuillez cliquer sur le lien dans l'email pour activer votre compte."
      });
    } else {
      setDialogContent({
        title: "Email déjà utilisé",
        description: "Un compte existe déjà avec cet email. Veuillez vous connecter."
      });
    }
    setShowDialog(true);
  };

  const {
    isLoading,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    phone,
    setPhone,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    handleSubmit,
    areRequiredFieldsFilled,
  } = useRegisterForm(handleSuccess);

  return (
    <div className="flex flex-col h-full max-h-[80vh]">
      <div className="flex-1 overflow-y-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Créer un compte client</h2>
          <p className="text-gray-600">
            Créez votre compte client pour commencer à expédier vos colis
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <RegisterFormFields
            firstName={firstName}
            lastName={lastName}
            email={email}
            phone={phone}
            password={password}
            confirmPassword={confirmPassword}
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
            onEmailChange={setEmail}
            onPhoneChange={setPhone}
            onPasswordChange={setPassword}
            onConfirmPasswordChange={setConfirmPassword}
          />

          <div className="sticky bottom-0 pt-4 space-y-4 border-t mt-4 bg-white">
            <Button
              type="submit"
              className="w-full bg-[#00B0F0] hover:bg-[#0082b3] text-white"
              disabled={isLoading || !areRequiredFieldsFilled()}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création en cours...
                </div>
              ) : (
                "Créer mon compte"
              )}
            </Button>

            <div className="text-center text-sm pb-2">
              <button
                type="button"
                className="text-[#00B0F0] hover:underline"
                onClick={onLogin}
              >
                Déjà un compte ? Se connecter
              </button>
            </div>
          </div>
        </form>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{dialogContent.title}</DialogTitle>
            <DialogDescription>
              {dialogContent.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              onClick={() => {
                setShowDialog(false);
                onLogin();
              }}
              className="w-full"
            >
              J'ai compris
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}