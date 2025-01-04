interface CompanyInfoProps {
  companyName: string;
  siret: string;
  address: string;
}

export function CompanyInfo({ companyName, siret, address }: CompanyInfoProps) {
  return (
    <div>
      <h3 className="font-semibold mb-2">Informations entreprise</h3>
      <p>Nom : {companyName}</p>
      <p>SIRET : {siret}</p>
      <p>Adresse : {address}</p>
    </div>
  );
}