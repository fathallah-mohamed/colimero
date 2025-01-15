import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function TestEmailButton() {
  const { toast } = useToast();

  const handleTestEmail = async () => {
    try {
      const { error } = await supabase.functions.invoke("test-activation-email");
      
      if (error) throw error;

      toast({
        title: "Email envoyé",
        description: "Un email de test a été envoyé à fathallahmohamed@hotmail.com",
      });
    } catch (error) {
      console.error("Error sending test email:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de l'envoi de l'email de test",
      });
    }
  };

  return (
    <Button onClick={handleTestEmail} className="bg-[#00B0F0] hover:bg-[#0082b3] text-white">
      Envoyer un email de test
    </Button>
  );
}