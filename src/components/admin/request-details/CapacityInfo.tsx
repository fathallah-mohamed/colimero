interface CapacityInfoProps {
  totalCapacity: number;
  pricePerKg: number;
  coverageArea: string[];
  services?: string[];
}

export function CapacityInfo({ totalCapacity, pricePerKg, coverageArea, services }: CapacityInfoProps) {
  return (
    <div className="col-span-2">
      <h3 className="font-semibold mb-2">Capacités</h3>
      <p>Capacité totale : {totalCapacity} kg</p>
      <p>Prix par kg : {pricePerKg} €</p>
      <p>Zone de couverture : {coverageArea?.join(", ")}</p>
      <p>Services : {services?.join(", ")}</p>
    </div>
  );
}