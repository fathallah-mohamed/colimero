import { XSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RejectedRequestDetailsProps {
  request: any;
  onClose: () => void;
}

export function RejectedRequestDetails({ request, onClose }: RejectedRequestDetailsProps) {
  if (!request) return null;

  return (
    <Dialog open={!!request} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XSquare className="h-5 w-5 text-destructive" />
            Détails de la demande rejetée - {request?.company_name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Informations personnelles</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Prénom :</span> {request?.first_name}</p>
              <p><span className="font-medium">Nom :</span> {request?.last_name}</p>
              <p><span className="font-medium">Email :</span> {request?.email}</p>
              <p><span className="font-medium">Téléphone :</span> {request?.phone}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Informations entreprise</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Nom :</span> {request?.company_name}</p>
              <p><span className="font-medium">SIRET :</span> {request?.siret}</p>
              <p><span className="font-medium">Adresse :</span> {request?.address}</p>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-4">
            <h3 className="font-semibold text-lg text-destructive">Raison du rejet</h3>
            <p className="p-4 bg-destructive/10 rounded-lg text-destructive">
              {request?.reason}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}