import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserCheck } from "lucide-react";

interface ApprovedCarrierDetailsProps {
  carrier: any;
  onClose: () => void;
}

export default function ApprovedCarrierDetails({ carrier, onClose }: ApprovedCarrierDetailsProps) {
  if (!carrier) return null;

  return (
    <Dialog open={carrier !== null} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            Détails du transporteur - {carrier?.company_name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Informations personnelles</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Prénom :</span> {carrier?.first_name}</p>
              <p><span className="font-medium">Nom :</span> {carrier?.last_name}</p>
              <p><span className="font-medium">Email :</span> {carrier?.email}</p>
              <p><span className="font-medium">Téléphone :</span> {carrier?.phone}</p>
              {carrier?.phone_secondary && (
                <p><span className="font-medium">Téléphone secondaire :</span> {carrier?.phone_secondary}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Informations entreprise</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Nom :</span> {carrier?.company_name}</p>
              <p><span className="font-medium">SIRET :</span> {carrier?.siret}</p>
              <p><span className="font-medium">Adresse :</span> {carrier?.address}</p>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-4">
            <h3 className="font-semibold text-lg">Zone de couverture</h3>
            <p className="p-4 bg-muted rounded-lg">
              {carrier?.coverage_area?.join(", ")}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}