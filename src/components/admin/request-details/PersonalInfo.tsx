interface PersonalInfoProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneSecondary?: string;
  address?: string;
  emailVerified?: boolean;
  createdAt?: string;
}

export function PersonalInfo({ 
  firstName, 
  lastName, 
  email, 
  phone, 
  phoneSecondary,
  address,
  emailVerified,
  createdAt
}: PersonalInfoProps) {
  return (
    <div>
      <h3 className="font-semibold mb-2">Informations personnelles</h3>
      <div className="space-y-2">
        <p>Prénom : {firstName}</p>
        <p>Nom : {lastName}</p>
        <p>Email : {email}</p>
        <p>Téléphone : {phone || "Non renseigné"}</p>
        {phoneSecondary && (
          <p>Téléphone secondaire : {phoneSecondary}</p>
        )}
        <p>Adresse : {address || "Non renseignée"}</p>
        <p>Email vérifié : {emailVerified ? "Oui" : "Non"}</p>
        {createdAt && (
          <p>Client depuis : {new Date(createdAt).toLocaleDateString('fr-FR')}</p>
        )}
      </div>
    </div>
  );
}