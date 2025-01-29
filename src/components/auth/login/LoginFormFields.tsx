import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UseFormReturn } from "react-hook-form";

export interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormFieldsProps {
  form: UseFormReturn<LoginFormValues>;
  isLoading: boolean;
  error: string | null;
  showVerificationDialog: boolean;
  showErrorDialog: boolean;
  onVerificationDialogClose: () => void;
  onErrorDialogClose: () => void;
}

export function LoginFormFields({
  form,
  isLoading,
  error,
  showVerificationDialog,
}: LoginFormFieldsProps) {
  // Ne pas afficher l'erreur si on est en mode vérification
  const shouldShowError = error && !showVerificationDialog;

  // Traduire les messages d'erreur courants
  const translateError = (error: string) => {
    switch (error) {
      case "Invalid login credentials":
        return "Email ou mot de passe incorrect";
      case "Email not confirmed":
        return "Veuillez vérifier votre email pour activer votre compte";
      default:
        return "Une erreur est survenue lors de la connexion";
    }
  };

  return (
    <>
      {shouldShowError && (
        <Alert variant="destructive">
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
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}