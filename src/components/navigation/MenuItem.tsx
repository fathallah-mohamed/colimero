import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface MenuItemProps {
  name: string;
  href: string;
  icon: React.ReactNode;
  highlight?: boolean;
  className?: string;
  allowedUserTypes: string[];
  userType: string | null;
  onClick?: () => void;
}

export function MenuItem({ 
  name, 
  href, 
  icon, 
  highlight, 
  className, 
  allowedUserTypes, 
  userType,
  onClick 
}: MenuItemProps) {
  const { toast } = useToast();

  const handleClick = (e: React.MouseEvent) => {
    if (!allowedUserTypes.includes(userType || '')) {
      e.preventDefault();
      if (!userType) {
        toast({
          title: "Accès restreint",
          description: "Vous devez être connecté pour accéder à cette fonctionnalité.",
          variant: "destructive",
        });
      } else {
        const messages = {
          admin: "Les administrateurs n'ont pas accès à cette fonctionnalité.",
          carrier: "Les transporteurs ne peuvent pas envoyer de colis.",
          client: "Les clients ne peuvent pas créer de tournées."
        };
        
        toast({
          title: "Accès restreint",
          description: messages[userType as keyof typeof messages],
          variant: "destructive",
        });
      }
      onClick?.();
    }
  };

  return (
    <Link
      to={href}
      onClick={handleClick}
      className={cn(
        "flex items-center px-3 py-2 rounded-md text-sm font-medium",
        highlight
          ? "text-[#00B0F0] hover:text-[#0082b3]"
          : "text-gray-700 hover:text-gray-900",
        !allowedUserTypes.includes(userType || '') && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {icon}
      <span className="ml-2">{name}</span>
    </Link>
  );
}