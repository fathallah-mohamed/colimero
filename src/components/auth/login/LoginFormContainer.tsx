import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { CarrierLoginForm } from "./CarrierLoginForm";
import { CustomDialog } from "@/components/ui/custom-dialog";
import { ForgotPasswordForm } from "../ForgotPasswordForm";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LoginFormContainerProps {
  onRegister?: () => void;
  onCarrierRegister?: () => void;
  onSuccess?: () => void;
  requiredUserType?: 'client' | 'carrier' | 'admin';
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
  const [activeTab, setActiveTab] = useState<string>("client");

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
      <Tabs defaultValue="client" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="client">Client</TabsTrigger>
          <TabsTrigger value="carrier">Transporteur</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>

        <TabsContent value="client">
          <LoginForm
            onForgotPassword={() => setShowForgotPassword(true)}
            onRegister={onRegister}
            onCarrierRegister={onCarrierRegister}
            onSuccess={handleLoginSuccess}
            requiredUserType="client"
            hideRegisterButton={activeTab !== "client"}
          />
        </TabsContent>

        <TabsContent value="carrier">
          <CarrierLoginForm
            onForgotPassword={() => setShowForgotPassword(true)}
            onCarrierRegister={onCarrierRegister}
            onSuccess={handleLoginSuccess}
            requiredUserType="carrier"
          />
        </TabsContent>

        <TabsContent value="admin">
          <LoginForm
            onForgotPassword={() => setShowForgotPassword(true)}
            onRegister={onRegister}
            onCarrierRegister={onCarrierRegister}
            onSuccess={handleLoginSuccess}
            requiredUserType="admin"
            hideRegisterButton={true}
          />
        </TabsContent>
      </Tabs>

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