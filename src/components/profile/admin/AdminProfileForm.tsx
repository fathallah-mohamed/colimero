import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PersonalInfoFields } from "../form/PersonalInfoFields";
import * as z from "zod";

const formSchema = z.object({
  first_name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres"),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
});

interface AdminProfileFormProps {
  initialData: any;
  onClose: () => void;
}

export function AdminProfileForm({ initialData, onClose }: AdminProfileFormProps) {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: initialData.first_name || "",
      last_name: initialData.last_name || "",
      phone: initialData.phone || "",
      address: initialData.address || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour modifier votre profil",
        });
        return;
      }

      // Update auth metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          first_name: values.first_name,
          last_name: values.last_name,
        }
      });

      if (metadataError) throw metadataError;

      // Update administrator profile
      const { error: profileError } = await supabase
        .from('administrators')
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          phone: values.phone,
          address: values.address,
        })
        .eq('id', session.user.id);

      if (profileError) throw profileError;

      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      });
      
      onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PersonalInfoFields form={form} />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit">
            Enregistrer
          </Button>
        </div>
      </form>
    </Form>
  );
}