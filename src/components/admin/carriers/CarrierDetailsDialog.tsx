import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CarrierDetailsDialogProps {
  carrier: any;
  onClose: () => void;
}

export default function CarrierDetailsDialog({ carrier, onClose }: CarrierDetailsDialogProps) {
  if (!carrier) return null;

  return (
    <Dialog open={!!carrier} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Détails du transporteur - {carrier.company_name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div>
            <h3 className="font-semibold mb-2">Informations personnelles</h3>
            <p>Prénom : {carrier.first_name}</p>
            <p>Nom : {carrier.last_name}</p>
            <p>Email : {carrier.email}</p>
            <p>Téléphone : {carrier.phone}</p>
            {carrier.phone_secondary && (
              <p>Téléphone secondaire : {carrier.phone_secondary}</p>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2">Informations entreprise</h3>
            <p>Nom : {carrier.company_name}</p>
            <p>SIRET : {carrier.siret}</p>
            <p>Adresse : {carrier.address}</p>
          </div>

          <div className="col-span-2">
            <h3 className="font-semibold mb-2">Zone de couverture</h3>
            <p>{carrier.coverage_area?.join(", ")}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}