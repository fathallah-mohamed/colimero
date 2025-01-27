import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddAdminForm } from "@/components/admin/AddAdminForm";
import { useToast } from "@/hooks/use-toast";

export default function AdminManagement() {
  const [showAddAdminDialog, setShowAddAdminDialog] = useState(false);
  const { toast } = useToast();

  const { data: administrators, refetch } = useQuery({
    queryKey: ['administrators'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('administrators')
        .select('*');
      
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des administrateurs",
          variant: "destructive",
        });
        throw error;
      }
      return data;
    }
  });

  const handleDeleteAdmin = async (adminId: string, adminEmail: string) => {
    // Prevent deletion of the main admin account
    if (adminEmail === 'admin@colimero.com') {
      toast({
        title: "Action non autorisée",
        description: "Impossible de supprimer le compte administrateur principal",
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

      toast({
        title: "Succès",
        description: "L'administrateur a été supprimé",
      });
      
      refetch();
    } catch (error) {
      console.error('Error deleting admin:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'administrateur",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Gestion des administrateurs</h1>
              <Button 
                onClick={() => setShowAddAdminDialog(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter un administrateur
              </Button>
            </div>

            <div className="space-y-4">
              {administrators?.map((admin) => (
                <div 
                  key={admin.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{admin.first_name} {admin.last_name}</p>
                    <p className="text-sm text-gray-600">{admin.email}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                    disabled={admin.email === 'admin@colimero.com'}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showAddAdminDialog} onOpenChange={setShowAddAdminDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un administrateur</DialogTitle>
          </DialogHeader>
          <AddAdminForm onSuccess={() => {
            setShowAddAdminDialog(false);
            refetch();
            toast({
              title: "Succès",
              description: "L'administrateur a été ajouté",
            });
          }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}