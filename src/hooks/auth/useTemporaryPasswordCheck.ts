import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useTemporaryPasswordCheck() {
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function checkTemporaryPassword() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoading(false);
          return;
        }

        // Check if user is a carrier and get their status
        const { data: carrier, error } = await supabase
          .from('carriers')
          .select('password_changed, status')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking carrier status:', error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de vérifier le statut du mot de passe",
          });
          return;
        }

        // If no carrier found or not active, don't require password change
        if (!carrier || carrier.status !== 'active') {
          setNeedsPasswordChange(false);
          return;
        }

        // Only require password change for active carriers who haven't changed their password
        setNeedsPasswordChange(carrier.password_changed === false);
      } catch (error) {
        console.error('Error in checkTemporaryPassword:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification du mot de passe",
        });
      } finally {
        setIsLoading(false);
      }
    }

    checkTemporaryPassword();
  }, [toast]);

  return { needsPasswordChange, isLoading };
}