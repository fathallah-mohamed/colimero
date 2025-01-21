import { Tour } from "../approval-requests/types";

interface CompanyInfoProps {
  tour: Tour;
}

export function CompanyInfo({ tour }: CompanyInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Informations de l'entreprise</h3>
      <div className="space-y-2">
        <p>
          <span className="text-gray-500">Nom de l'entreprise :</span>{" "}
          {tour.carriers?.company_name}
        </p>
        <p>
          <span className="text-gray-500">Email :</span> {tour.carriers?.email}
        </p>
        <p>
          <span className="text-gray-500">Téléphone :</span> {tour.carriers?.phone}
        </p>
      </div>
    </div>
  );
}