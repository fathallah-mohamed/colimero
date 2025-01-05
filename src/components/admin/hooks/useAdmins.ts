import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Admin {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

export function useAdmins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('administrators')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAdmins(data || []);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des administrateurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId: string, adminEmail: string) => {
    if (adminEmail === 'admin@colimero.com') {
      toast({
        title: "Action non autorisée",
        description: "L'administrateur principal ne peut pas être supprimé",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('administrators')
        .delete()
        .eq('id', adminId);

      if (error) throw error;

      setAdmins(admins.filter(admin => admin.id !== adminId));
      toast({
        title: "Succès",
        description: "L'administrateur a été supprimé",
      });
    } catch (error) {
      console.error('Error deleting admin:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'administrateur",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return {
    admins,
    loading,
    handleDeleteAdmin,
    fetchAdmins
  };
}