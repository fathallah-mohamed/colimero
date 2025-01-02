import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { RegisterForm } from "./RegisterForm";
import CarrierAuthDialog from "./CarrierAuthDialog";
import { ClientLoginForm } from "./login/ClientLoginForm";
import { CarrierLoginForm } from "./login/CarrierLoginForm";
import { GeneralLoginForm } from "./login/GeneralLoginForm";
import { AdminLoginForm } from "./login/AdminLoginForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type View = "login" | "register" | "forgot-password";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  requiredUserType?: 'client' | 'carrier' | 'admin';
  onRegisterClick?: () => void;
}

export default function AuthDialog({ 
  isOpen, 
  onClose, 
  onSuccess, 
  requiredUserType,
  onRegisterClick 
}: AuthDialogProps) {
  const [view, setView] = useState<View>("login");
  const [showCarrierDialog, setShowCarrierDialog] = useState(false);
  const [loginType, setLoginType] = useState<'general' | 'client' | 'carrier' | 'admin'>('general');

  const handleRegisterClick = () => {
    if (requiredUserType === 'carrier' && onRegisterClick) {
      onRegisterClick();
    } else {
      setView("register");
    }
  };

  const handleCarrierRegisterClick = () => {
    onClose();
    setShowCarrierDialog(true);
  };

  const getDialogTitle = () => {
    if (view === "login") {
      if (requiredUserType === 'client') {
        return "Connexion requise pour réserver";
      } else if (requiredUserType === 'carrier') {
        return "Connexion requise pour créer une tournée";
      } else if (requiredUserType === 'admin') {
        return "Connexion administrateur";
      }
      return "Connexion";
    }
    return "Créer un compte client";
  };

  const getDialogDescription = () => {
    if (view === "login") {
      if (requiredUserType === 'client') {
        return "Connectez-vous pour réserver cette tournée.";
      } else if (requiredUserType === 'carrier') {
        return "Connectez-vous pour créer une tournée.";
      } else if (requiredUserType === 'admin') {
        return "Connectez-vous pour accéder au tableau de bord administrateur.";
      }
      return "Connectez-vous à votre compte.";
    }
    return "Créez votre compte client pour commencer à expédier vos colis";
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-2xl font-bold">
                {getDialogTitle()}
              </DialogTitle>
            </div>
            <p className="text-lg text-gray-600">
              {getDialogDescription()}
            </p>
          </DialogHeader>

          {view === "login" ? (
            requiredUserType ? (
              requiredUserType === 'admin' ? (
                <AdminLoginForm />
              ) : requiredUserType === 'client' ? (
                <ClientLoginForm
                  onForgotPassword={() => setView("forgot-password")}
                  onRegister={handleRegisterClick}
                  onSuccess={onSuccess}
                />
              ) : (
                <CarrierLoginForm
                  onForgotPassword={() => setView("forgot-password")}
                  onCarrierRegister={handleCarrierRegisterClick}
                  onSuccess={onSuccess}
                />
              )
            ) : (
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="general">Général</TabsTrigger>
                  <TabsTrigger value="client">Client</TabsTrigger>
                  <TabsTrigger value="carrier">Transporteur</TabsTrigger>
                  <TabsTrigger value="admin">Admin</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                  <GeneralLoginForm
                    onForgotPassword={() => setView("forgot-password")}
                    onRegister={handleRegisterClick}
                    onCarrierRegister={handleCarrierRegisterClick}
                    onSuccess={onSuccess}
                  />
                </TabsContent>
                <TabsContent value="client">
                  <ClientLoginForm
                    onForgotPassword={() => setView("forgot-password")}
                    onRegister={handleRegisterClick}
                    onSuccess={onSuccess}
                  />
                </TabsContent>
                <TabsContent value="carrier">
                  <CarrierLoginForm
                    onForgotPassword={() => setView("forgot-password")}
                    onCarrierRegister={handleCarrierRegisterClick}
                    onSuccess={onSuccess}
                  />
                </TabsContent>
                <TabsContent value="admin">
                  <AdminLoginForm />
                </TabsContent>
              </Tabs>
            )
          ) : view === "register" ? (
            <RegisterForm onLogin={() => setView("login")} />
          ) : (
            <ForgotPasswordForm
              onSuccess={() => setView("login")}
              onCancel={() => setView("login")}
            />
          )}
        </DialogContent>
      </Dialog>

      <CarrierAuthDialog 
        isOpen={showCarrierDialog} 
        onClose={() => setShowCarrierDialog(false)} 
      />
    </>
  );
}