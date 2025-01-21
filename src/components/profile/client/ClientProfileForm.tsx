import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PersonalInfoFields } from "../form/PersonalInfoFields";
import { ContactInfoFields } from "../form/ContactInfoFields";
import { formSchema, type FormValues } from "../form/formSchema";

interface ClientProfileFormProps {
  initialData: any;
  onClose: () => void;
}

export function ClientProfileForm({ initialData, onClose }: ClientProfileFormProps) {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: initialData.first_name || "",
      last_name: initialData.last_name || "",
      phone: initialData.phone || "",
      address: initialData.address || "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      console.log("Starting profile update with values:", values);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour modifier votre profil",
        });
        return;
      }

      console.log("Updating auth user metadata...");
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          first_name: values.first_name,
          last_name: values.last_name,
        }
      });

      if (metadataError) {
        console.error("Error updating user metadata:", metadataError);
        throw metadataError;
      }

      console.log("Updating client profile...");
      const { error: profileError } = await supabase
        .from('clients')
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          phone: values.phone,
          address: values.address,
        })
        .eq('id', session.user.id);

      if (profileError) {
        console.error("Error updating client profile:", profileError);
        throw profileError;
      }

      console.log("Profile update successful");
      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      });
      
      onClose();
      window.location.reload();
    } catch (error: any) {
      console.error('Error in profile update:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour du profil",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PersonalInfoFields form={form} />
        <ContactInfoFields form={form} />

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