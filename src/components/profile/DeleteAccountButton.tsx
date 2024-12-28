import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();

  const handleDeleteProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez être connecté pour supprimer votre profil",
      });
      return;
    }

    const { error } = await supabase.auth.admin.deleteUser(session.user.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le profil",
      });
    } else {
      await supabase.auth.signOut();
      navigate('/');
      toast({
        title: "Compte supprimé",
        description: "Votre compte a été définitivement supprimé",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="flex items-center gap-2">
          <Trash2 className="h-4 w-4" />
          Supprimer mon compte
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>Cette action est irréversible et entraînera :</p>
            <ul className="list-disc pl-4">
              <li>La suppression définitive de votre compte</li>
              <li>La perte de toutes vos données</li>
              <li>La déconnexion immédiate</li>
              <li>La redirection vers la page d'accueil</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDeleteProfile} 
            className="bg-red-500 hover:bg-red-600"
          >
            Supprimer définitivement
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};