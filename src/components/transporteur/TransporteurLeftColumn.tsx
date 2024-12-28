import { TransporteurContact } from "./TransporteurContact";
import { TransporteurCapacities } from "./TransporteurCapacities";
import { TransporteurServices } from "./TransporteurServices";

interface TransporteurLeftColumnProps {
  email: string;
  phone: string;
  phoneSecondary?: string | null;
  address?: string;
  capacities: any;
  services: any[];
}

export function TransporteurLeftColumn({
  email,
  phone,
  phoneSecondary,
  address,
  capacities,
  services,
}: TransporteurLeftColumnProps) {
  return (
    <div className="space-y-6">
      <TransporteurContact
        email={email}
        phone={phone}
        phoneSecondary={phoneSecondary}
        address={address}
      />
      <TransporteurServices services={services} />
      <TransporteurCapacities capacities={capacities} />
    </div>
  );
}