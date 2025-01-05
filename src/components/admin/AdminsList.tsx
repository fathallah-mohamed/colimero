import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function AdminsList() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const { toast } = useToast();

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('administrators')
        .select('*');

      if (error) throw error;
      setAdmins(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger la liste des administrateurs",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create auth user with admin role
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newAdminData.email,
        password: newAdminData.password,
        options: {
          data: {
            first_name: newAdminData.firstName,
            last_name: newAdminData.lastName,
            user_type: 'admin'
          }
        }
      });

      if (authError) throw authError;

      toast({
        title: "Succès",
        description: "L'administrateur a été créé avec succès",
      });

      setShowCreateDialog(false);
      fetchAdmins();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAdmin = async (adminId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet administrateur ?")) return;

    try {
      const { error } = await supabase
        .from('administrators')
        .delete()
        .eq('id', adminId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "L'administrateur a été supprimé avec succès",
      });

      fetchAdmins();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'administrateur",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des administrateurs</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          Ajouter un administrateur
        </Button>
      </div>

      <div className="grid gap-4">
        {admins.map((admin) => (
          <div key={admin.id} className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <p className="font-medium">{admin.first_name} {admin.last_name}</p>
              <p className="text-sm text-gray-500">{admin.email}</p>
            </div>
            <Button
              variant="destructive"
              onClick={() => deleteAdmin(admin.id)}
            >
              Supprimer
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un administrateur</DialogTitle>
          </DialogHeader>
          <form onSubmit={createAdmin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newAdminData.email}
                onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={newAdminData.firstName}
                onChange={(e) => setNewAdminData({ ...newAdminData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={newAdminData.lastName}
                onChange={(e) => setNewAdminData({ ...newAdminData, lastName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={newAdminData.password}
                onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Création en cours..." : "Créer l'administrateur"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}