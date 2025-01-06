import { Link } from "react-router-dom";
import { UserCircle2, Package, Truck, Users, ClipboardList, UserCog } from "lucide-react";

interface UserMenuItem {
  name: string;
  href: string;
  icon: JSX.Element;
}

interface UserMenuItemsProps {
  userType: string | null;
}

export function UserMenuItems({ userType }: UserMenuItemsProps) {
  const userMenuItems: UserMenuItem[] = userType === 'carrier' ? [
    { name: "Profil", href: "/profil", icon: <UserCircle2 className="w-4 h-4" /> },
    { name: "Mes tournées", href: "/mes-tournees", icon: <Truck className="w-4 h-4" /> },
    { name: "Demandes d'approbation", href: "/demandes-approbation", icon: <Users className="w-4 h-4" /> }
  ] : userType === 'admin' ? [
    { name: "Profil", href: "/profil", icon: <UserCircle2 className="w-4 h-4" /> },
    { name: "Demandes d'inscription", href: "/admin", icon: <ClipboardList className="w-4 h-4" /> },
    { name: "Clients", href: "/admin/clients", icon: <Users className="w-4 h-4" /> },
    { name: "Administrateurs", href: "/admin/gestion", icon: <UserCog className="w-4 h-4" /> }
  ] : [
    { name: "Profil", href: "/profil", icon: <UserCircle2 className="w-4 h-4" /> },
    { name: "Mes réservations", href: "/mes-reservations", icon: <Package className="w-4 h-4" /> },
    { name: "Mes demandes d'approbation", href: "/mes-demandes-approbation", icon: <ClipboardList className="w-4 h-4" /> }
  ];

  return (
    <>
      {userMenuItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          {item.icon}
          <span className="ml-2">{item.name}</span>
        </Link>
      ))}
    </>
  );
}