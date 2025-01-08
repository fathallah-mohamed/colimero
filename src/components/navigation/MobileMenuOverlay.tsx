import { cn } from "@/lib/utils";

interface MobileMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenuOverlay({ isOpen, onClose }: MobileMenuOverlayProps) {
  return (
    <div 
      className={cn(
        "fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden z-[998]",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={onClose}
      aria-hidden="true"
    />
  );
}