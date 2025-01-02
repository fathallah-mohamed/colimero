import { FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function IdDocumentUpload() {
  const { toast } = useToast();

  const handleIdDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Non authentifié");

      const fileExt = file.name.split('.').pop();
      const filePath = `${session.user.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('id-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('clients')
        .update({ id_document: filePath })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      toast({
        title: "Succès",
        description: "Document d'identité mis à jour avec succès",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    }
  };

  return (
    <div className="space-y-2">
      <FormLabel>Pièce d'identité</FormLabel>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('idDocument')?.click()}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Télécharger un document
        </Button>
      </div>
      <input
        id="idDocument"
        type="file"
        className="hidden"
        accept="image/*,.pdf"
        onChange={handleIdDocumentUpload}
      />
    </div>
  );
}