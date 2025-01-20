import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RecipientDialog } from "@/components/recipients/RecipientDialog";
import { RecipientsList } from "@/components/recipients/RecipientsList";
import { useToast } from "@/hooks/use-toast";

export default function Recipients() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<any>(null);
  const { toast } = useToast();

  const { data: recipients, refetch } = useQuery({
    queryKey: ["recipients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les destinataires",
        });
        throw error;
      }

      return data;
    },
  });

  const handleSuccess = () => {
    refetch();
    setShowAddDialog(false);
    setEditingRecipient(null);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mes Destinataires</h1>
          <p className="text-gray-600">
            Gérez vos destinataires pour faciliter vos réservations
          </p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter un destinataire
        </Button>
      </div>

      <RecipientsList
        recipients={recipients || []}
        onEdit={setEditingRecipient}
        onRefresh={refetch}
      />

      <RecipientDialog
        open={showAddDialog || !!editingRecipient}
        onOpenChange={(open) => {
          setShowAddDialog(open);
          if (!open) setEditingRecipient(null);
        }}
        recipient={editingRecipient}
        onSuccess={handleSuccess}
      />
    </div>
  );
}