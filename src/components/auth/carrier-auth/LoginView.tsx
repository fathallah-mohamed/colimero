import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type FormValues = z.infer<typeof formSchema>;

interface LoginViewProps {
  onForgotPassword: () => void;
  onCarrierRegister: () => void;
  onSuccess?: () => void;
}

export function LoginView({ onForgotPassword, onCarrierRegister, onSuccess }: LoginViewProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'default' | 'destructive'; message: string } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      setStatusMessage(null);

      // First, check carrier status before attempting login
      const { data: carrierData, error: carrierError } = await supabase
        .from('carriers')
        .select('status')
        .eq('email', values.email)
        .single();

      if (carrierError && carrierError.code !== 'PGRST116') {
        console.error("Error checking carrier status:", carrierError);
        setStatusMessage({
          type: 'destructive',
          message: "Une erreur est survenue lors de la vérification de votre compte."
        });
        return;
      }

      // If carrier exists, verify status
      if (carrierData) {
        if (carrierData.status === 'pending') {
          setStatusMessage({
            type: 'default',
            message: "Votre compte est en attente de validation par Colimero. Vous recevrez un email une fois votre compte validé."
          });
          return;
        }

        if (carrierData.status === 'rejected') {
          setStatusMessage({
            type: 'destructive',
            message: "Votre demande d'inscription a été rejetée. Vous ne pouvez pas vous connecter."
          });
          return;
        }

        if (carrierData.status !== 'active') {
          setStatusMessage({
            type: 'destructive',
            message: "Votre compte n'est pas actif. Veuillez contacter l'administrateur."
          });
          return;
        }
      }

      // Only proceed with login if carrier is active
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (signInError) {
        console.error("Login error:", signInError);
        setStatusMessage({
          type: 'destructive',
          message: signInError.message === "Invalid login credentials"
            ? "Email ou mot de passe incorrect"
            : "Une erreur est survenue lors de la connexion"
        });
        return;
      }

      // Double check carrier status after successful login
      const { data: finalCheck, error: finalCheckError } = await supabase
        .from('carriers')
        .select('status')
        .eq('email', values.email)
        .single();

      if (finalCheckError || !finalCheck) {
        console.error("Final check error:", finalCheckError);
        await supabase.auth.signOut();
        setStatusMessage({
          type: 'destructive',
          message: "Vous n'avez pas les autorisations nécessaires pour vous connecter en tant que transporteur."
        });
        return;
      }

      if (finalCheck.status !== 'active') {
        await supabase.auth.signOut();
        setStatusMessage({
          type: 'destructive',
          message: "Votre compte n'est pas actif. Veuillez attendre la validation de votre compte."
        });
        return;
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/');
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setStatusMessage({
        type: 'destructive',
        message: "Une erreur est survenue lors de la connexion"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      {statusMessage && (
        <Alert variant={statusMessage.type}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {statusMessage.type === 'destructive' ? 'Erreur' : 'Attention'}
          </AlertTitle>
          {statusMessage.message}
        </Alert>
      )}

      <Form {...form}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} />
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
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>

      <div className="flex flex-col gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </Button>

        <div className="text-center space-y-2">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-primary hover:underline"
          >
            Mot de passe oublié ?
          </button>

          <div className="text-sm text-gray-500">
            Pas encore de compte ?{" "}
            <button
              type="button"
              onClick={onCarrierRegister}
              className="text-primary hover:underline"
            >
              Devenir transporteur
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}