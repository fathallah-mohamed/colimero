import { ArrowLeftRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TourFiltersProps {
  departureCountry: string;
  destinationCountry: string;
  onDepartureChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
}

const MAGHREB_COUNTRIES = ["TN", "DZ", "MA"];

const countryNames: { [key: string]: string } = {
  'FR': 'France',
  'TN': 'Tunisie',
  'DZ': 'Algérie',
  'MA': 'Maroc'
};

export function TourFilters({
  departureCountry,
  destinationCountry,
  onDepartureChange,
  onDestinationChange,
}: TourFiltersProps) {
  const handleSwitch = () => {
    // Allow switching if either country is France, or if one is France and the other is Maghreb
    const isValidSwitch = 
      departureCountry === 'FR' || 
      destinationCountry === 'FR' ||
      (MAGHREB_COUNTRIES.includes(departureCountry) && !MAGHREB_COUNTRIES.includes(destinationCountry)) ||
      (MAGHREB_COUNTRIES.includes(destinationCountry) && !MAGHREB_COUNTRIES.includes(departureCountry));

    if (isValidSwitch) {
      onDepartureChange(destinationCountry);
      onDestinationChange(departureCountry);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Pays de départ
          </label>
          <Select value={departureCountry} onValueChange={onDepartureChange}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Pays de départ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FR">{countryNames.FR}</SelectItem>
              <SelectItem value="TN">{countryNames.TN}</SelectItem>
              <SelectItem value="DZ">{countryNames.DZ}</SelectItem>
              <SelectItem value="MA">{countryNames.MA}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-center pt-6">
          <button 
            onClick={handleSwitch}
            className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeftRight className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Pays de destination
          </label>
          <Select 
            value={destinationCountry} 
            onValueChange={onDestinationChange}
            disabled={MAGHREB_COUNTRIES.includes(departureCountry)}
          >
            <SelectTrigger className={`w-full ${MAGHREB_COUNTRIES.includes(departureCountry) ? 'bg-gray-50' : 'bg-white'}`}>
              <SelectValue placeholder="Pays de destination" />
            </SelectTrigger>
            <SelectContent>
              {departureCountry === "FR" ? (
                <>
                  <SelectItem value="TN">{countryNames.TN}</SelectItem>
                  <SelectItem value="DZ">{countryNames.DZ}</SelectItem>
                  <SelectItem value="MA">{countryNames.MA}</SelectItem>
                </>
              ) : (
                <SelectItem value="FR">{countryNames.FR}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}