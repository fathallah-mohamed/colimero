import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useTemporaryPasswordCheck() {
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPasswordStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoading(false);
          return;
        }

        // Check if user is a carrier and hasn't changed their password
        const { data: carrierData, error } = await supabase
          .from("carriers")
          .select("password_changed, status")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        // Only show password change dialog for active carriers who haven't changed their password
        setNeedsPasswordChange(
          carrierData?.status === "active" && !carrierData?.password_changed
        );
      } catch (error) {
        console.error("Error checking password status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkPasswordStatus();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkPasswordStatus();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { needsPasswordChange, isLoading };
}