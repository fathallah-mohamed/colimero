import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

interface Admin {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

interface AdminFormData {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

export function AdminsList() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm<AdminFormData>();

  useEffect(() => {
    fetchAdmins();
  }, []);

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
    // Ne pas permettre la suppression de l'admin principal
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

  const onSubmit = async (data: AdminFormData) => {
    try {
      // Créer un nouvel utilisateur avec le rôle admin
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.first_name,
            last_name: data.last_name,
            user_type: 'admin'
          }
        }
      });

      if (authError) throw authError;

      toast({
        title: "Succès",
        description: "L'administrateur a été créé avec succès",
      });

      // Fermer le dialogue et réinitialiser le formulaire
      setOpen(false);
      reset();
      
      // Rafraîchir la liste des administrateurs
      fetchAdmins();
    } catch (error) {
      console.error('Error creating admin:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'administrateur",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Liste des administrateurs</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Ajouter un administrateur</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un administrateur</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="first_name">Prénom</Label>
                <Input
                  id="first_name"
                  {...register("first_name")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Nom</Label>
                <Input
                  id="last_name"
                  {...register("last_name")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Créer l'administrateur
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => (
            <TableRow key={admin.id}>
              <TableCell>{admin.first_name} {admin.last_name}</TableCell>
              <TableCell>{admin.email}</TableCell>
              <TableCell>{new Date(admin.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                  disabled={admin.email === 'admin@colimero.com'}
                >
                  Supprimer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {admins.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucun administrateur trouvé
        </div>
      )}
    </div>
  );
}