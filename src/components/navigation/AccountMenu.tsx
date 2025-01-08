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
import { 
  UserCircle2, 
  LogOut, 
  Settings, 
  Package, 
  ClipboardList, 
  UserCog,
  Users,
  Building2
} from "lucide-react";

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
          <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer">
            <Link to="/profile">
              <UserCircle2 className="w-4 h-4" />
              <span>Profil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer">
            <Link to="/admin/dashboard">
              <ClipboardList className="w-4 h-4" />
              <span>Demandes d'inscription</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer">
            <Link to="/admin/clients">
              <Users className="w-4 h-4" />
              <span>Clients</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer">
            <Link to="/admin/gestion">
              <UserCog className="w-4 h-4" />
              <span>Administrateurs</span>
            </Link>
          </DropdownMenuItem>
        </>
      );
    }

    if (userType === 'carrier') {
      return (
        <>
          <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer">
            <Link to="/profile">
              <UserCircle2 className="w-4 h-4" />
              <span>Profil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer">
            <Link to="/mes-tournees">
              <Package className="w-4 h-4" />
              <span>Mes tournées</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer">
            <Link to="/demandes-approbation">
              <ClipboardList className="w-4 h-4" />
              <span>Demandes d'approbation</span>
            </Link>
          </DropdownMenuItem>
        </>
      );
    }

    if (userType === 'client') {
      return (
        <>
          <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer">
            <Link to="/profile">
              <UserCircle2 className="w-4 h-4" />
              <span>Profil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer">
            <Link to="/mes-reservations">
              <Package className="w-4 h-4" />
              <span>Mes réservations</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer">
            <Link to="/mes-demandes-approbation">
              <ClipboardList className="w-4 h-4" />
              <span>Mes demandes</span>
            </Link>
          </DropdownMenuItem>
        </>
      );
    }

    return null;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative hover:bg-primary/10 transition-colors"
        >
          <UserCircle2 className="w-5 h-5 text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {getMenuItems()}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="flex items-center gap-2 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}