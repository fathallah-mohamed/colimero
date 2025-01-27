import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { CustomDialog } from "@/components/ui/custom-dialog";
import { ForgotPasswordForm } from "../ForgotPasswordForm";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface LoginFormContainerProps {
  onRegister?: () => void;
  onCarrierRegister?: () => void;
  onSuccess?: () => void;
  requiredUserType?: "client" | "carrier" | "admin";
}

export function LoginFormContainer({
  onRegister,
  onCarrierRegister,
  onSuccess,
  requiredUserType,
}: LoginFormContainerProps) {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    toast({
      title: "Connexion réussie",
      description: "Vous êtes maintenant connecté",
    });
    
    if (onSuccess) {
      onSuccess();
    } else {
      const returnPath = sessionStorage.getItem('returnPath');
      if (returnPath) {
        sessionStorage.removeItem('returnPath');
        navigate(returnPath);
      } else {
        navigate('/');
      }
    }
  };

  const handleForgotPasswordSuccess = () => {
    setShowForgotPassword(false);
    toast({
      title: "Email envoyé",
      description: "Consultez votre boîte mail pour réinitialiser votre mot de passe",
    });
  };

  return (
    <>
      <LoginForm
        onForgotPassword={() => setShowForgotPassword(true)}
        onRegister={onRegister}
        onCarrierRegister={onCarrierRegister}
        onSuccess={handleLoginSuccess}
        requiredUserType={requiredUserType}
        hideRegisterButton={requiredUserType === "admin"}
      />

      <CustomDialog
        open={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        title="Mot de passe oublié"
      >
        <div className="p-6">
          <ForgotPasswordForm 
            onSuccess={handleForgotPasswordSuccess}
            onCancel={() => setShowForgotPassword(false)}
          />
        </div>
      </CustomDialog>
    </>
  );
}