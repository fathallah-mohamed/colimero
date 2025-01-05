import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientLoginForm } from "../login/ClientLoginForm";
import { CarrierLoginForm } from "../login/CarrierLoginForm";
import { useState } from "react";

interface TabsAuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: string;
  onSuccess: () => void;
  onRegisterClick?: () => void;
  onCarrierRegisterClick?: () => void;
}

export function TabsAuthDialog({
  isOpen,
  onClose,
  defaultTab = "client",
  onSuccess,
  onRegisterClick,
  onCarrierRegisterClick,
}: TabsAuthDialogProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

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
              onSuccess={onSuccess}
              hideRegisterButton={false}
            />
          </TabsContent>
          <TabsContent value="carrier">
            <CarrierLoginForm
              onForgotPassword={() => {}}
              onCarrierRegister={onCarrierRegisterClick}
              onSuccess={onSuccess}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}