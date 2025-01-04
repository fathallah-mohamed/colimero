import { CollectionPointRow } from "@/components/tour/collection-points/CollectionPointRow";

interface TourCollectionPointsProps {
  route: any[];
  selectedPoint?: string;
  onPointSelect: (cityName: string) => void;
}

export function TourCollectionPoints({ 
  route, 
  selectedPoint, 
  onPointSelect 
}: TourCollectionPointsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 text-sm text-gray-500 px-2">
        <span>Ville</span>
        <span>Adresse</span>
        <span>Date</span>
        <span>Heure</span>
        <span className="text-center">Sélection</span>
      </div>
      {route.map((stop, index) => (
        <CollectionPointRow
          key={index}
          name={stop.name}
          location={stop.location}
          time={stop.time}
          collectionDate={stop.collection_date}
          isSelected={selectedPoint === stop.name}
          onSelect={() => onPointSelect(stop.name)}
        />
      ))}
    </div>
  );
}