import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useModalDialog } from "@/hooks/use-modal-dialog";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const DeleteAccountButton = () => {
  const navigate = useNavigate();
  const { showDialog } = useModalDialog();

  const handleDeleteProfile = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { deleted: true }
      });

      if (error) throw error;

      await supabase.auth.signOut();
      navigate('/');
      showDialog({
        title: "Compte désactivé",
        description: "Votre compte a été désactivé avec succès",
        variant: "default"
      });
    } catch (error: any) {
      showDialog({
        title: "Erreur",
        description: "Impossible de supprimer le profil",
        variant: "destructive"
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600"
        >
          <Trash2 className="h-4 w-4" />
          Supprimer mon compte
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold text-gray-900">
            Êtes-vous absolument sûr ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            <p className="text-gray-500 mb-2">Cette action est irréversible et entraînera :</p>
            <ul className="list-disc pl-6 text-gray-500 space-y-1">
              <li>La désactivation définitive de votre compte</li>
              <li>La perte de toutes vos données</li>
              <li>La déconnexion immédiate</li>
              <li>La redirection vers la page d'accueil</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:bg-gray-100">
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDeleteProfile} 
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Supprimer définitivement
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};