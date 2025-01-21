import { Card, CardContent } from "@/components/ui/card";
import { ApprovalRequest } from "../approval-requests/types";

interface CompanyInfoProps {
  tour?: ApprovalRequest['tour'] | null;
}

export function CompanyInfo({ tour }: CompanyInfoProps) {
  if (!tour?.carrier) return null;

  return (
    <Card>
      <CardContent className="space-y-2 pt-6">
        <h3 className="font-medium">Informations du transporteur</h3>
        <div className="text-sm text-gray-500">
          <p>Nom de l'entreprise : {tour.carrier.company_name}</p>
          <p>Email : {tour.carrier.email}</p>
          <p>Téléphone : {tour.carrier.phone}</p>
        </div>
      </CardContent>
    </Card>
  );
}