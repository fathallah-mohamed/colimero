import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ClientDetailsDialogProps {
  client: any;
  onClose: () => void;
}

export function ClientDetailsDialog({ client, onClose }: ClientDetailsDialogProps) {
  if (!client) return null;

  return (
    <Dialog open={!!client} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Détails du client</DialogTitle>
          <DialogDescription>
            Informations complètes du client
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Informations personnelles</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nom complet</p>
                  <p className="font-medium">
                    {client.first_name} {client.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{client.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Téléphone principal</p>
                  <p className="font-medium">{client.phone || "Non renseigné"}</p>
                </div>
                {client.phone_secondary && (
                  <div>
                    <p className="text-sm text-gray-500">Téléphone secondaire</p>
                    <p className="font-medium">{client.phone_secondary}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="font-medium">{client.address || "Non renseignée"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Client depuis</p>
                  <p className="font-medium">
                    {format(new Date(client.created_at), "dd MMMM yyyy", {
                      locale: fr,
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Statut du compte</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email vérifié</p>
                  <p className="font-medium">
                    {client.email_verified ? "Oui" : "Non"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Statut</p>
                  <p className="font-medium">
                    {client.status || "Actif"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}