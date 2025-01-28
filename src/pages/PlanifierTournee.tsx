import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import PlanningContent from '@/components/tour/planning/PlanningContent';

export default function PlanifierTournee() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/connexion');
          return;
        }

        if (session) {
          const currentUserType = session.user.user_metadata?.user_type;
          setUserType(currentUserType);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking session:", error);
        setIsLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <PlanningContent />
    </div>
  );
}