import { TransporteurContact } from "./TransporteurContact";
import { TransporteurCapacities } from "./TransporteurCapacities";

interface TransporteurLeftColumnProps {
  email: string;
  phone: string;
  phoneSecondary?: string | null;
  address?: string;
  capacities: any;
}

export function TransporteurLeftColumn({
  email,
  phone,
  phoneSecondary,
  address,
  capacities,
}: TransporteurLeftColumnProps) {
  return (
    <div className="space-y-6">
      <TransporteurContact
        email={email}
        phone={phone}
        phoneSecondary={phoneSecondary}
        address={address}
      />
      <TransporteurCapacities capacities={capacities} />
    </div>
  );
}