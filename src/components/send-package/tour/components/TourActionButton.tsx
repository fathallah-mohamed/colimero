import { Button } from "@/components/ui/button";

interface TourActionButtonProps {
  isEnabled: boolean;
  onClick: () => void;
  text: string;
}

export function TourActionButton({ isEnabled, onClick, text }: TourActionButtonProps) {
  return (
    <Button 
      onClick={onClick}
      className="w-full bg-[#0FA0CE] hover:bg-[#0FA0CE]/90 text-white"
      disabled={!isEnabled}
    >
      {text}
    </Button>
  );
}