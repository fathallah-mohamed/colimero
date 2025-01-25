import { Button } from "@/components/ui/button";
import { StatusChangeButtonProps } from "./types";

export function StatusChangeButton({ 
  onClick, 
  icon, 
  label, 
  variant = "outline",
  className = ""
}: StatusChangeButtonProps) {
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={onClick}
      className={`gap-2 ${className}`}
    >
      {icon}
      {label}
    </Button>
  );
}