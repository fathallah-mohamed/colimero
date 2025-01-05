import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminFormData {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

interface AddAdminFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddAdminForm({ onSuccess, onCancel }: AddAdminFormProps) {
  const { register, handleSubmit, reset } = useForm<AdminFormData>();
  const { toast } = useToast();

  const onSubmit = async (data: AdminFormData) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.first_name,
            last_name: data.last_name,
            user_type: 'admin'
          }
        }
      });

      if (authError) throw authError;

      toast({
        title: "Succès",
        description: "L'administrateur a été créé avec succès",
      });

      reset();
      onSuccess();
    } catch (error) {
      console.error('Error creating admin:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'administrateur",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="first_name">Prénom</Label>
        <Input
          id="first_name"
          {...register("first_name")}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="last_name">Nom</Label>
        <Input
          id="last_name"
          {...register("last_name")}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Créer l'administrateur
      </Button>
    </form>
  );
}