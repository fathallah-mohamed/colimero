import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "outline" | "default";
  colorClass?: string;
}

export function ActionButton({ 
  icon: Icon, 
  label, 
  onClick, 
  variant = "outline",
  colorClass = "text-[#8B5CF6] hover:text-[#7C3AED] border-[#8B5CF6] hover:border-[#7C3AED]"
}: ActionButtonProps) {
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={onClick}
      className={`flex items-center gap-2 bg-white hover:bg-gray-50 transition-colors ${colorClass}`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  );
}