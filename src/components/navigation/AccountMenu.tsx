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
  Building2,
  Truck,
  User
} from "lucide-react";
import { getMenuItems } from "./menu/MenuItems";
import { useUserData } from "./menu/useUserData";

interface AccountMenuProps {
  userType: string | null;
  onClose?: () => void;
}

export default function AccountMenu({ userType, onClose }: AccountMenuProps) {
  const { toast } = useToast();
  const userData = useUserData(userType);

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

  const getUserIcon = () => {
    switch (userType) {
      case 'admin':
        return <Building2 className="w-4 h-4" />;
      case 'carrier':
        return <Truck className="w-4 h-4" />;
      case 'client':
        return <User className="w-4 h-4" />;
      default:
        return <UserCircle2 className="w-4 h-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative hover:bg-primary/10 transition-colors flex items-center gap-2"
        >
          {getUserIcon()}
          <span className="font-medium">
            {userData ? `${userData.first_name} ${userData.last_name}` : 'Mon compte'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {getMenuItems(userType)}
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