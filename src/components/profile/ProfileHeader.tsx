import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export interface ProfileHeaderProps {
  title: string;
  description: string;
  onEdit: () => void;
}

export function ProfileHeader({ title, description, onEdit }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col space-y-2 mb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <Button onClick={onEdit} variant="outline" size="sm">
          <Pencil className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      </div>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}