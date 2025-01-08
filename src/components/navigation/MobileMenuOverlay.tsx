import { cn } from "@/lib/utils";

interface MobileMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenuOverlay({ isOpen, onClose }: MobileMenuOverlayProps) {
  return (
    <div 
      className={cn(
        "fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 md:hidden",
        isOpen ? "opacity-100 z-40" : "opacity-0 pointer-events-none"
      )}
      onClick={onClose}
      aria-hidden="true"
    />
  );
}