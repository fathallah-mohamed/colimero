import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LoginFormFields, LoginFormValues } from "./login/LoginFormFields";
import { useLoginForm } from "@/hooks/auth/login/useLoginForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { EmailVerificationDialog } from "./EmailVerificationDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const loginSchema = z.object({
  email: z.string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  password: z.string()
    .min(1, "Le mot de passe est requis")
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

interface LoginFormProps {
  onForgotPassword: () => void;
  onRegister: () => void;
  onCarrierRegister: () => void;
  onSuccess?: () => void;
  requiredUserType?: 'client' | 'carrier';
  hideRegisterButton?: boolean;
}

export function LoginForm({
  onForgotPassword,
  onRegister,
  onCarrierRegister,
  onSuccess,
  requiredUserType,
  hideRegisterButton = false,
}: LoginFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    isLoading,
    error,
    showVerificationDialog,
    showErrorDialog,
    setShowVerificationDialog,
    setShowErrorDialog,
    handleLogin,
  } = useLoginForm({ 
    onSuccess: () => {
      if (!showVerificationDialog) {
        const returnPath = sessionStorage.getItem('returnPath');
        if (returnPath) {
          sessionStorage.removeItem('returnPath');
          navigate(returnPath);
        } else {
          navigate('/');
        }
      }
    }, 
    requiredUserType,
    onVerificationNeeded: async (email: string) => {
      try {
        console.log("Checking user profile for:", email);
        
        // 1. Vérifier d'abord si l'utilisateur existe dans auth.users
        const { data: { user }, error: authError } = await supabase.auth.admin.getUserByEmail(email);
        
        if (authError) {
          console.error("Error checking auth user:", authError);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Une erreur est survenue lors de la vérification du compte.",
          });
          return;
        }

        if (!user) {
          console.log("No user found in auth.users");
          toast({
            title: "Compte inexistant",
            description: "Ce compte n'existe pas. Veuillez créer un compte.",
          });
          onRegister();
          return;
        }

        // 2. Vérifier le type de profil
        const { data: adminData } = await supabase
          .from('administrators')
          .select('id')
          .eq('email', email.trim())
          .maybeSingle();

        if (adminData) {
          console.log("Admin account found");
          return; // Les admins n'ont pas besoin de vérification
        }

        const { data: carrierData } = await supabase
          .from('carriers')
          .select('email_verified, status')
          .eq('email', email.trim())
          .maybeSingle();

        if (carrierData) {
          console.log("Carrier account found:", carrierData);
          if (!carrierData.email_verified || carrierData.status !== 'active') {
            toast({
              variant: "destructive",
              title: "Compte en attente",
              description: "Votre compte transporteur est en attente de validation.",
            });
            setShowErrorDialog(true);
          }
          return;
        }

        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('email_verified, status')
          .eq('email', email.trim())
          .maybeSingle();

        if (clientError) {
          console.error("Error checking client:", clientError);
          return;
        }

        if (!clientData) {
          console.log("No client profile found");
          toast({
            title: "Compte inexistant",
            description: "Ce compte n'existe pas. Veuillez créer un compte.",
          });
          onRegister();
          return;
        }

        console.log("Client account found:", clientData);
        if (!clientData.email_verified || clientData.status !== 'active') {
          setShowVerificationDialog(true);
          form.reset({ email: form.getValues("email"), password: "" });
        }

      } catch (error) {
        console.error("Error in onVerificationNeeded:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification du compte.",
        });
      }
    }
  });

  const onSubmit = async (values: LoginFormValues) => {
    console.log("Form submitted with values:", values);
    await handleLogin(values.email, values.password);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <LoginFormFields
          form={form}
          isLoading={isLoading}
          error={error}
          showVerificationDialog={showVerificationDialog}
          showErrorDialog={showErrorDialog}
          onVerificationDialogClose={() => setShowVerificationDialog(false)}
          onErrorDialogClose={() => setShowErrorDialog(false)}
        />

        <div className="space-y-4">
          <Button
            type="submit"
            className="w-full bg-[#00B0F0] hover:bg-[#0082b3] text-white"
            disabled={isLoading}
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </Button>

          {!hideRegisterButton && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Pas encore de compte ?
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onRegister}
                  className="w-full"
                >
                  Créer un compte client
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={onCarrierRegister}
                  className="w-full"
                >
                  Créer un compte transporteur
                </Button>
              </div>
            </>
          )}

          <div className="text-center">
            <button
              type="button"
              className="text-sm text-[#00B0F0] hover:underline"
              onClick={onForgotPassword}
            >
              Mot de passe oublié ?
            </button>
          </div>
        </div>
      </form>
    </Form>
  );
}