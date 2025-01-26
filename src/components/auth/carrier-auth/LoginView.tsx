import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCarrierLogin } from "@/hooks/auth/login/useCarrierLogin";
import { StatusMessage } from "./StatusMessage";
import { LoginActions } from "./LoginActions";

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
  const { isLoading, error, handleLogin } = useCarrierLogin({ onSuccess });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    handleLogin(values.email, values.password);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <StatusMessage type="destructive" message={error} />
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

      <LoginActions
        isLoading={isLoading}
        onForgotPassword={onForgotPassword}
        onCarrierRegister={onCarrierRegister}
      />
    </form>
  );
}