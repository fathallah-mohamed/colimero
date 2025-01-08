import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { UserCircle2 } from "lucide-react";

interface AccountMenuProps {
  userType: string | null;
  onClose?: () => void;
}

export default function AccountMenu({ userType, onClose }: AccountMenuProps) {
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      
      if (onClose) {
        onClose();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    }
  };

  const getMenuItems = () => {
    if (userType === 'admin') {
      return (
        <>
          <DropdownMenuItem asChild>
            <Link to="/profile" className="w-full">Profil</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/admin/dashboard" className="w-full">Demandes d'inscription</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/admin/clients" className="w-full">Clients</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/admin/gestion" className="w-full">Administrateurs</Link>
          </DropdownMenuItem>
        </>
      );
    }

    if (userType === 'carrier') {
      return (
        <>
          <DropdownMenuItem asChild>
            <Link to="/profile" className="w-full">Profil</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/mes-tournees" className="w-full">Mes tournées</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/demandes-approbation" className="w-full">Demandes d'approbation</Link>
          </DropdownMenuItem>
        </>
      );
    }

    if (userType === 'client') {
      return (
        <>
          <DropdownMenuItem asChild>
            <Link to="/profile" className="w-full">Profil</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/mes-reservations" className="w-full">Mes réservations</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/mes-demandes-approbation" className="w-full">Mes demandes</Link>
          </DropdownMenuItem>
        </>
      );
    }

    return null;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <UserCircle2 className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {getMenuItems()}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}