import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EmailVerificationDialog } from "@/components/auth/EmailVerificationDialog";
import { ErrorDialog } from "@/components/ui/error-dialog";
import { UseFormReturn } from "react-hook-form";
import { ActivationDialog } from "../activation/ActivationDialog";

export interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormFieldsProps {
  form: UseFormReturn<LoginFormValues>;
  isLoading: boolean;
  error: string | null;
  showVerificationDialog?: boolean;
  showErrorDialog?: boolean;
  showActivationDialog?: boolean;
  onVerificationDialogClose?: () => void;
  onErrorDialogClose?: () => void;
  onActivationDialogClose?: () => void;
  onResendEmail?: () => void;
  onActivationSuccess?: () => void;
}

export function LoginFormFields({
  form,
  isLoading,
  error,
  showVerificationDialog = false,
  showErrorDialog = false,
  showActivationDialog = false,
  onVerificationDialogClose = () => {},
  onErrorDialogClose = () => {},
  onActivationDialogClose = () => {},
  onResendEmail = () => {},
  onActivationSuccess = () => {},
}: LoginFormFieldsProps) {
  return (
    <>
      {error && !showVerificationDialog && !showErrorDialog && !showActivationDialog && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
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
                  <Input
                    placeholder="votre@email.com"
                    {...field}
                    disabled={isLoading}
                    autoComplete="email"
                    type="email"
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
                    type="password"
                    {...field}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>

      {showVerificationDialog && (
        <EmailVerificationDialog
          isOpen={showVerificationDialog}
          onClose={onVerificationDialogClose}
          email={form.getValues("email")}
          showConfirmationDialog={false}
          onConfirmationClose={() => {}}
          onResendEmail={onResendEmail}
        />
      )}

      {showActivationDialog && (
        <ActivationDialog
          isOpen={showActivationDialog}
          onClose={onActivationDialogClose}
          email={form.getValues("email")}
          onSuccess={onActivationSuccess}
        />
      )}

      {showErrorDialog && !showVerificationDialog && !showActivationDialog && (
        <ErrorDialog 
          isOpen={showErrorDialog}
          onClose={onErrorDialogClose}
          title="Erreur de connexion"
          description={error || "Une erreur est survenue lors de la connexion"}
        />
      )}
    </>
  );
}