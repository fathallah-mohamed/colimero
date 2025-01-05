import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
  fromHeader?: boolean;
  onRegisterClick?: () => void;
  onCarrierRegisterClick?: () => void;
  onSuccess?: () => void;
  requiredUserType?: 'client' | 'carrier';
}

export function AuthDialog({
  open,
  onClose,
  fromHeader = false,
  onRegisterClick,
  onCarrierRegisterClick,
  onSuccess,
  requiredUserType
}: AuthDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm 
              onSuccess={onSuccess} 
              requiredUserType={requiredUserType}
              onForgotPassword={() => {}}
              onRegister={onRegisterClick}
              onCarrierRegister={onCarrierRegisterClick}
            />
          </TabsContent>
          <TabsContent value="register" className="space-y-4">
            <div className="space-y-4 text-center">
              <h2 className="text-lg font-semibold">Choisissez votre profil</h2>
              <div className="flex flex-col gap-4">
                <Button 
                  variant="outline" 
                  onClick={onRegisterClick}
                  className="w-full"
                >
                  Je suis un client
                </Button>
                <Button 
                  variant="outline"
                  onClick={onCarrierRegisterClick}
                  className="w-full"
                >
                  Je suis un transporteur
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}