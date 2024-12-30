import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type View = "login" | "register" | "forgot-password";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  requiredUserType?: 'client' | 'carrier';
}

export default function AuthDialog({ isOpen, onClose, onSuccess, requiredUserType }: AuthDialogProps) {
  const [view, setView] = useState<View>("login");

  const getErrorMessage = () => {
    if (requiredUserType === 'client') {
      return (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2">
            Cette fonctionnalité est réservée aux clients. Les transporteurs ne peuvent pas réserver de tournées. 
            Veuillez vous connecter avec un compte client.
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold">
              {view === "login" ? "Connexion requise" : "Créer un compte client"}
            </DialogTitle>
          </div>
          <p className="text-lg text-gray-600">
            {view === "login" 
              ? "Connectez-vous pour réserver cette tournée."
              : "Créez votre compte client pour commencer à expédier vos colis"
            }
          </p>
        </DialogHeader>

        {getErrorMessage()}

        {view === "login" ? (
          <LoginForm
            onForgotPassword={() => setView("forgot-password")}
            onRegister={() => setView("register")}
            onSuccess={onSuccess}
            requiredUserType={requiredUserType}
          />
        ) : (
          <RegisterForm onLogin={() => setView("login")} />
        )}
      </DialogContent>
    </Dialog>
  );
}