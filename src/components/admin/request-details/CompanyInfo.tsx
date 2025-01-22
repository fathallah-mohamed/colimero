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
          <p>Nom de l'entreprise : {request.tour.carrier.company_name}</p>
          <p>Email : {request.tour.carrier.email}</p>
          <p>Téléphone : {request.tour.carrier.phone}</p>
        </div>
      </CardContent>
    </Card>
  );
}