import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientLoginForm } from "./login/ClientLoginForm";
import { CarrierLoginForm } from "./login/CarrierLoginForm";
import { useState } from "react";
import { useLocation } from "react-router-dom";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: string;
  onSuccess?: () => void;
  requiredUserType?: 'client' | 'carrier';
  onRegisterClick?: () => void;
  onCarrierRegisterClick?: () => void;
}

export default function AuthDialog({ 
  isOpen, 
  onClose, 
  defaultTab = "client",
  onSuccess,
  requiredUserType,
  onRegisterClick,
  onCarrierRegisterClick
}: AuthDialogProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const location = useLocation();

  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  // Sauvegarder le chemin actuel si on est sur une page de réservation
  if (location.pathname.includes('/reserver/')) {
    sessionStorage.setItem('returnPath', location.pathname + location.search);
  }

  // Si un type d'utilisateur spécifique est requis, ne pas afficher les onglets
  if (requiredUserType) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogTitle>
            {requiredUserType === 'client' ? 'Connexion Client' : 'Connexion Transporteur'}
          </DialogTitle>
          {requiredUserType === 'client' ? (
            <ClientLoginForm
              onForgotPassword={() => {}}
              onRegister={onRegisterClick}
              onSuccess={handleSuccess}
              requiredUserType={requiredUserType}
            />
          ) : (
            <CarrierLoginForm
              onForgotPassword={() => {}}
              onCarrierRegister={onCarrierRegisterClick}
              onSuccess={handleSuccess}
              requiredUserType={requiredUserType}
            />
          )}
        </DialogContent>
      </Dialog>
    );
  }

  // Sinon, afficher les onglets avec les deux options
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Connexion</DialogTitle>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="client">Client</TabsTrigger>
            <TabsTrigger value="carrier">Transporteur</TabsTrigger>
          </TabsList>
          <TabsContent value="client">
            <ClientLoginForm
              onForgotPassword={() => {}}
              onRegister={onRegisterClick}
              onSuccess={handleSuccess}
            />
          </TabsContent>
          <TabsContent value="carrier">
            <CarrierLoginForm
              onForgotPassword={() => {}}
              onCarrierRegister={onCarrierRegisterClick}
              onSuccess={handleSuccess}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}