import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useClientAuth } from "@/hooks/auth/useClientAuth";

const loginSchema = z.object({
  email: z.string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  password: z.string()
    .min(1, "Le mot de passe est requis")
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface ClientLoginFormProps {
  onRegister: () => void;
  onForgotPassword: () => void;
  onSuccess?: () => void;
}

export function ClientLoginForm({
  onRegister,
  onForgotPassword,
  onSuccess,
}: ClientLoginFormProps) {
  const [showActivationDialog, setShowActivationDialog] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const { isLoading, statusMessage, handleLogin, handleResendActivation } = useClientAuth(onSuccess);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setCurrentEmail(values.email);
    await handleLogin(values.email, values.password);
    
    if (statusMessage?.message.includes("activer votre compte")) {
      setShowActivationDialog(true);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {statusMessage && statusMessage.type === 'destructive' && (
            <Alert variant="destructive">
              <AlertDescription>{statusMessage.message}</AlertDescription>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="votre@email.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full bg-[#00B0F0] hover:bg-[#0082b3] text-white"
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>

            <div className="flex flex-col space-y-2 text-center text-sm">
              <button
                type="button"
                onClick={onRegister}
                className="text-[#00B0F0] hover:underline"
              >
                Créer un compte
              </button>

              <button
                type="button"
                onClick={onForgotPassword}
                className="text-[#00B0F0] hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </div>
          </div>
        </form>
      </Form>

      <Dialog open={showActivationDialog} onOpenChange={setShowActivationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compte non activé</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-center text-gray-600">
              Votre compte n'est pas encore activé. Un code d'activation a été envoyé à l'adresse <span className="font-medium">{currentEmail}</span>.
            </p>
            
            <p className="text-sm text-center text-gray-500">
              Si vous n'avez pas reçu le code, vous pouvez en demander un nouveau.
            </p>

            <div className="flex justify-center">
              <Button
                onClick={() => {
                  handleResendActivation(currentEmail);
                  setShowActivationDialog(false);
                }}
                variant="outline"
                disabled={isLoading}
              >
                {isLoading ? "Envoi..." : "Renvoyer le code"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}