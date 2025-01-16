import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";

interface CarrierAuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CarrierAuthDialog({ isOpen, onClose }: CarrierAuthDialogProps) {
  const navigate = useNavigate();

  if (isOpen) {
    onClose();
    navigate("/devenir-transporteur");
  }

  return null;
}