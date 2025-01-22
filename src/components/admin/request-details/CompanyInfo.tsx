import { Card, CardContent } from "@/components/ui/card";
import { ApprovalRequest } from "../approval-requests/types";

interface CompanyInfoProps {
  request: ApprovalRequest;
}

export function CompanyInfo({ request }: CompanyInfoProps) {
  return (
    <Card>
      <CardContent className="space-y-2 pt-6">
        <h3 className="font-medium">Informations de l'entreprise</h3>
        <div className="text-sm text-gray-500">
          <p>Nom de l'entreprise : {request.company_name}</p>
          <p>SIRET : {request.siret || 'Non renseigné'}</p>
          <p>Adresse : {request.address}</p>
        </div>
      </CardContent>
    </Card>
  );
}