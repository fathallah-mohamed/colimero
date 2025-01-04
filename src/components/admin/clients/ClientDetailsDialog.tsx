import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ClientDetailsDialogProps {
  client: any;
  onClose: () => void;
}

export default function ClientDetailsDialog({ client, onClose }: ClientDetailsDialogProps) {
  if (!client) return null;

  return (
    <Dialog open={!!client} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Détails du client - {client.first_name} {client.last_name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div>
            <h3 className="font-semibold mb-2">Informations personnelles</h3>
            <p>Prénom : {client.first_name}</p>
            <p>Nom : {client.last_name}</p>
            <p>Email : {client.email}</p>
            <p>Téléphone : {client.phone}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Informations complémentaires</h3>
            <p>Date de naissance : {client.birth_date}</p>
            <p>Adresse : {client.address}</p>
            <p>Statut : {client.status === 'active' ? 'Actif' : 'Suspendu'}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}