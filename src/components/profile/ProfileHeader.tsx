import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  onEdit: () => void;
}

export function ProfileHeader({ onEdit }: ProfileHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Mon profil</h1>
      <Button 
        variant="outline" 
        className="flex items-center gap-2 hover:bg-primary/10" 
        onClick={onEdit}
      >
        <Pencil className="h-4 w-4" />
        Modifier
      </Button>
    </div>
  );
}