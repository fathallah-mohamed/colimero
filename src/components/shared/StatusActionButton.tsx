import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface StatusActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "default" | "outline";
  colorClass?: string;
  disabled?: boolean;
}

export function StatusActionButton({
  icon: Icon,
  label,
  onClick,
  variant = "outline",
  colorClass = "",
  disabled = false
}: StatusActionButtonProps) {
  return (
    <Button
      variant={variant}
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