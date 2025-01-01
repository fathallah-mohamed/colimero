import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface BookingActionButtonProps {
  onClick: () => void;
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
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <Button
      variant={variant}
      size="sm"
      className={colorClass}
      onClick={handleClick}
    >
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
}