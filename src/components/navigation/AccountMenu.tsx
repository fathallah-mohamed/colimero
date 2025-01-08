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
  Building2,
  Truck,
  User
} from "lucide-react";

interface AccountMenuProps {
  userType: string | null;
  onClose?: () => void;
}

export default function AccountMenu({ userType, onClose }: AccountMenuProps) {
  const { toast } = useToast();
  const [userData, setUserData] = useState<{ first_name: string; last_name: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let profileData;
      if (userType === 'admin') {
        const { data } = await supabase.from('administrators').select('first_name, last_name').eq('id', user.id).single();
        profileData = data;
      } else if (userType === 'carrier') {
        const { data } = await supabase.from('carriers').select('first_name, last_name').eq('id', user.id).single();
        profileData = data;
      } else {
        const { data } = await supabase.from('clients').select('first_name, last_name').eq('id', user.id).single();
        profileData = data;
      }

      if (profileData) {
        setUserData(profileData);
      }
    };

    fetchUserData();
  }, [userType]);

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
          className="relative hover:bg-primary/10 transition-colors flex items-center gap-2"
        >
          {getUserIcon()}
          <span className="font-medium">
            {userData ? `${userData.first_name} ${userData.last_name}` : 'Mon compte'}
          </span>
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