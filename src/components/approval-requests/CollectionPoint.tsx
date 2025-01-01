import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CollectionPointProps {
  pickupCity: string;
  selectedStop: any;
  collectionDate: string;
}

export function CollectionPoint({ pickupCity, selectedStop, collectionDate }: CollectionPointProps) {
  return (
    <div className="bg-gray-50 p-3 rounded-md">
      <h3 className="font-medium text-gray-900 mb-2">Point de collecte :</h3>
      <p className="text-sm text-gray-600">
        Ville : {pickupCity || 'Non spécifiée'}
      </p>
      {selectedStop && (
        <>
          <p className="text-sm text-gray-600">
            Emplacement : {selectedStop.location}
          </p>
          <p className="text-sm text-gray-600">
            Date de collecte : {format(new Date(collectionDate), "EEEE d MMMM yyyy", { locale: fr })}
          </p>
          <p className="text-sm text-gray-600">
            Heure : {selectedStop.time}
          </p>
        </>
      )}
    </div>
  );
}