import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useAuthRedirect() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          return;
        }

        if (!session?.user) {
          console.log('No session found, redirecting to login');
          navigate('/connexion');
          return;
        }

        const userType = session.user.user_metadata?.user_type;
        console.log('User type:', userType);

        if (userType === 'client') {
          const { data: clientData, error: clientError } = await supabase
            .from('clients')
            .select('email_verified, status')
            .eq('id', session.user.id)
            .single();

          if (clientError) {
            console.error('Error checking client status:', clientError);
            return;
          }

          console.log('Client status:', clientData);

          if (!clientData?.email_verified || clientData?.status !== 'active') {
            console.log('Account needs verification, redirecting to activation');
            await supabase.auth.signOut();
            navigate('/activation-compte', { replace: true });
            toast({
              title: "Compte non activé",
              description: "Veuillez activer votre compte pour continuer.",
            });
            return;
          }
        }
      } catch (error) {
        console.error('Auth redirect error:', error);
      }
    };

    checkAuthAndRedirect();
  }, [navigate, toast]);
}