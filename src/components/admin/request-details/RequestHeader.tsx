import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface RequestHeaderProps {
  companyName: string;
}

export function RequestHeader({ companyName }: RequestHeaderProps) {
  return (
    <DialogHeader>
      <DialogTitle>Détails de la demande - {companyName}</DialogTitle>
    </DialogHeader>
  );
}