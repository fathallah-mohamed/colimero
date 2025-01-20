import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RecipientDialog } from "./RecipientDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Recipient {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

export function RecipientsList() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recipientToDelete, setRecipientToDelete] = useState<Recipient | null>(null);
  const { toast } = useToast();

  const fetchRecipients = async () => {
    try {
      const { data, error } = await supabase
        .from('recipients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRecipients(data || []);
    } catch (error) {
      console.error('Error fetching recipients:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les destinataires",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipients();
  }, []);

  const handleEdit = (recipient: Recipient) => {
    setSelectedRecipient(recipient);
    setDialogOpen(true);
  };

  const handleDelete = async (recipient: Recipient) => {
    setRecipientToDelete(recipient);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!recipientToDelete) return;

    try {
      const { error } = await supabase
        .from('recipients')
        .delete()
        .eq('id', recipientToDelete.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le destinataire a été supprimé",
      });

      await fetchRecipients();
    } catch (error) {
      console.error('Error deleting recipient:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le destinataire",
      });
    } finally {
      setDeleteDialogOpen(false);
      setRecipientToDelete(null);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Mes destinataires</h2>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un destinataire
        </Button>
      </div>

      {recipients.length === 0 ? (
        <Card className="p-6 text-center text-gray-500">
          Vous n'avez pas encore ajouté de destinataire
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recipients.map((recipient) => (
            <Card key={recipient.id} className="p-4 space-y-4">
              <div>
                <h3 className="font-medium">
                  {recipient.first_name} {recipient.last_name}
                </h3>
                <p className="text-sm text-gray-500">{recipient.phone}</p>
              </div>
              <div className="text-sm">
                <p>{recipient.address}</p>
                <p>{recipient.city}, {recipient.country}</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(recipient)}
                  className="gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(recipient)}
                  className="gap-2 text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <RecipientDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        recipient={selectedRecipient}
        onSuccess={() => {
          fetchRecipients();
          setSelectedRecipient(undefined);
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce destinataire ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}