import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  onEdit: () => void;
}

export function ProfileHeader({ onEdit }: ProfileHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-900">Mon profil</h1>
      <div className="flex gap-2">
        <Button variant="outline" className="flex items-center gap-2" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
          Modifier
        </Button>
      </div>
    </div>
  );
}