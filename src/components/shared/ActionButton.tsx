import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  colorClass?: string;
  disabled?: boolean;
}

export function ActionButton({
  icon: Icon,
  label,
  onClick,
  colorClass = "",
  disabled = false
}: ActionButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 ${colorClass}`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  );
}