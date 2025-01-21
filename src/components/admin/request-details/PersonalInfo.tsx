import { Client } from "../approval-requests/types";

interface PersonalInfoProps {
  client: Client;
}

export function PersonalInfo({ client }: PersonalInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Informations personnelles</h3>
      <div className="space-y-2">
        <p>
          <span className="text-gray-500">Nom complet :</span>{" "}
          {client.first_name} {client.last_name}
        </p>
        <p>
          <span className="text-gray-500">Email :</span> {client.email}
        </p>
        <p>
          <span className="text-gray-500">Téléphone :</span> {client.phone}
        </p>
      </div>
    </div>
  );
}