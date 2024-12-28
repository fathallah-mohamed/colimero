import type { Tour } from "@/types/tour";

export interface TransporteurToursProps {
  tours: Tour[];
  type: "public" | "private";
  isLoading: boolean;
}

export function TransporteurTours({ tours, type, isLoading }: TransporteurToursProps) {
  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        Tournées {type === "public" ? "Publiques" : "Privées"}
      </h2>
      <ul className="space-y-4">
        {tours.map(tour => (
          <li key={tour.id} className="border p-4 rounded-md shadow">
            <h3 className="font-bold">{tour.departure_country} → {tour.destination_country}</h3>
            <p>Date de départ: {tour.departure_date}</p>
            <p>Capacité totale: {tour.total_capacity}</p>
            <p>Capacité restante: {tour.remaining_capacity}</p>
            <p>Transporteur: {tour.carriers?.company_name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
