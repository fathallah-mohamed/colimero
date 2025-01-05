import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientLoginForm } from "./login/ClientLoginForm";
import { CarrierLoginForm } from "./login/CarrierLoginForm";
import { useState } from "react";
import { useLocation } from "react-router-dom";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: string;
}

export default function AuthDialog({ isOpen, onClose, defaultTab = "client" }: AuthDialogProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const location = useLocation();

  const handleSuccess = () => {
    onClose();
  };

  // Sauvegarder le chemin actuel si on est sur une page de réservation
  if (location.pathname.includes('/reserver/')) {
    sessionStorage.setItem('returnPath', location.pathname);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="client">Client</TabsTrigger>
            <TabsTrigger value="carrier">Transporteur</TabsTrigger>
          </TabsList>
          <TabsContent value="client">
            <ClientLoginForm
              onForgotPassword={() => {}}
              onRegister={() => {}}
              onSuccess={handleSuccess}
            />
          </TabsContent>
          <TabsContent value="carrier">
            <CarrierLoginForm
              onForgotPassword={() => {}}
              onCarrierRegister={() => {}}
              onSuccess={handleSuccess}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}