interface PersonalInfoProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneSecondary?: string;
}

export function PersonalInfo({ firstName, lastName, email, phone, phoneSecondary }: PersonalInfoProps) {
  return (
    <div>
      <h3 className="font-semibold mb-2">Informations personnelles</h3>
      <p>Prénom : {firstName}</p>
      <p>Nom : {lastName}</p>
      <p>Email : {email}</p>
      <p>Téléphone : {phone}</p>
      {phoneSecondary && (
        <p>Téléphone secondaire : {phoneSecondary}</p>
      )}
    </div>
  );
}