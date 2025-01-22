import { ApprovalRequest } from "../approval-requests/types";

interface PersonalInfoProps {
  request: ApprovalRequest;
}

export function PersonalInfo({ request }: PersonalInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Informations personnelles</h3>
      <div className="space-y-2">
        <p>
          <span className="text-gray-500">Nom complet :</span>{" "}
          {request.client.first_name} {request.client.last_name}
        </p>
        <p>
          <span className="text-gray-500">Email :</span> {request.client.email}
        </p>
        <p>
          <span className="text-gray-500">Téléphone :</span> {request.client.phone}
        </p>
      </div>
    </div>
  );
}