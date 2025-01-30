import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UseFormReturn } from "react-hook-form";
import { AlertCircle } from "lucide-react";

export interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormFieldsProps {
  form: UseFormReturn<LoginFormValues>;
  isLoading: boolean;
  error: string | null;
}

export function LoginFormFields({
  form,
  isLoading,
  error,
}: LoginFormFieldsProps) {
  // Traduire les messages d'erreur courants
  const translateError = (error: string) => {
    switch (error) {
      case "Invalid login credentials":
        return "Email ou mot de passe incorrect";
      case "Email not confirmed":
        return "Veuillez vérifier votre email pour activer votre compte";
      case "Account not activated":
        return "Votre compte n'est pas encore activé. Veuillez vérifier votre email.";
      default:
        return "Une erreur est survenue lors de la connexion";
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive" className="border-red-500">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{translateError(error)}</AlertDescription>
        </Alert>
      )}

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="email"
                placeholder="votre@email.com"
                disabled={isLoading}
                autoComplete="email"
              />
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
              <Input
                {...field}
                type="password"
                disabled={isLoading}
                autoComplete="current-password"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}