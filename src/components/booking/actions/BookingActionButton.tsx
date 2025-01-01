import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface BookingActionButtonProps {
  onClick: (e: React.MouseEvent) => void;
  icon: LucideIcon;
  label: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  colorClass?: string;
}

export function BookingActionButton({ 
  onClick, 
  icon: Icon, 
  label, 
  variant = "outline",
  colorClass
}: BookingActionButtonProps) {
  return (
    <Button
      variant={variant}
      size="sm"
      className={colorClass}
      onClick={onClick}
    >
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
}