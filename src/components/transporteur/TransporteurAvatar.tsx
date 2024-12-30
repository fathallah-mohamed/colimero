import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TransporteurAvatarProps {
  avatarUrl?: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-24 w-24",
};

export function TransporteurAvatar({ avatarUrl, name, size = "md" }: TransporteurAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const defaultAvatarUrl = "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952";

  return (
    <Avatar className={`${sizes[size]} bg-white/10`}>
      <AvatarImage
        src={avatarUrl || defaultAvatarUrl}
        alt={name}
        className="object-cover"
      />
      <AvatarFallback className="bg-blue-500 text-white">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}