import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientLoginForm } from "./ClientLoginForm";
import { CarrierLoginForm } from "./CarrierLoginForm";

interface TabbedLoginViewProps {
  onRegisterClick: () => void;
  onCarrierRegisterClick: () => void;
  handleSuccess: () => void;
}

export function TabbedLoginView({
  onRegisterClick,
  onCarrierRegisterClick,
  handleSuccess,
}: TabbedLoginViewProps) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <Tabs defaultValue="client">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="client">Client</TabsTrigger>
          <TabsTrigger value="carrier">Transporteur</TabsTrigger>
        </TabsList>
        <TabsContent value="client" className="space-y-6">
          <ClientLoginForm
            onForgotPassword={() => {}}
            onRegister={onRegisterClick}
            onSuccess={handleSuccess}
          />
          <Button
            type="button"
            variant="outline"
            onClick={onRegisterClick}
            className="w-full"
          >
            Créer un compte client
          </Button>
        </TabsContent>
        <TabsContent value="carrier" className="space-y-6">
          <CarrierLoginForm
            onForgotPassword={() => {}}
            onCarrierRegister={onCarrierRegisterClick}
            onSuccess={handleSuccess}
          />
          <Button
            type="button"
            variant="outline"
            onClick={onCarrierRegisterClick}
            className="w-full"
          >
            Devenir transporteur
          </Button>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
}