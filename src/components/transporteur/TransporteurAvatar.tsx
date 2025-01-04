import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface TransporteurAvatarProps {
  avatarUrl?: string | null;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizes = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-24 w-24",
  xl: "h-32 w-32"
};

export function TransporteurAvatar({ avatarUrl, name, size = "md" }: TransporteurAvatarProps) {
  const initials = name
    ? name.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "";

  const defaultAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;

  return (
    <Avatar className={`${sizes[size]} bg-white/10`}>
      <AvatarImage
        src={avatarUrl || defaultAvatarUrl}
        alt={name}
        className="object-cover"
      />
      <AvatarFallback className="bg-blue-500 text-white">
        {initials || <User className="h-6 w-6" />}
      </AvatarFallback>
    </Avatar>
  );
}