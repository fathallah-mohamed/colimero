import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EmailVerificationDialog } from "@/components/auth/EmailVerificationDialog";
import { ErrorDialog } from "@/components/ui/error-dialog";
import { UseFormReturn } from "react-hook-form";
import { LoginFormValues } from "@/types/auth";

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
  showErrorDialog,
  onVerificationDialogClose,
  onErrorDialogClose,
}: LoginFormFieldsProps) {
  return (
    <>
      {error && (
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>

      <EmailVerificationDialog
        isOpen={showVerificationDialog}
        onClose={onVerificationDialogClose}
        email={form.getValues("email")}
        showConfirmationDialog={false}
        onConfirmationClose={() => {}}
        onResendEmail={() => {}}
      />

      <ErrorDialog 
        isOpen={showErrorDialog}
        onClose={onErrorDialogClose}
        title="Erreur de connexion"
        description={error || "Une erreur est survenue lors de la connexion"}
      />
    </>
  );
}

export type { LoginFormValues };