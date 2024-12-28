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
  transporteurName: string;
}

export function TransporteurLeftColumn({
  email,
  phone,
  phoneSecondary,
  address,
  capacities,
  services,
  transporteurName,
}: TransporteurLeftColumnProps) {
  return (
    <div className="space-y-6 w-full">
      <TransporteurContact
        email={email}
        phone={phone}
        phoneSecondary={phoneSecondary}
        address={address}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TransporteurServices services={services} />
        <TransporteurCapacities capacities={capacities} />
      </div>
    </div>
  );
}