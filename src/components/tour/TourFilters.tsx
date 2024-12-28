import { ArrowLeftRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TourFiltersProps {
  departureCountry: string;
  destinationCountry: string;
  onDepartureChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
}

const MAGHREB_COUNTRIES = ["TN", "DZ", "MA"];

export function TourFilters({
  departureCountry,
  destinationCountry,
  onDepartureChange,
  onDestinationChange,
}: TourFiltersProps) {
  const isMaghrebCountry = MAGHREB_COUNTRIES.includes(departureCountry);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Pays de départ</label>
          <Select value={departureCountry} onValueChange={onDepartureChange}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Pays de départ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FR">France</SelectItem>
              <SelectItem value="TN">Tunisie</SelectItem>
              <SelectItem value="DZ">Algérie</SelectItem>
              <SelectItem value="MA">Maroc</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Pays de destination</label>
          <Select 
            value={destinationCountry} 
            onValueChange={onDestinationChange}
            disabled={isMaghrebCountry}
          >
            <SelectTrigger className={`w-full ${isMaghrebCountry ? 'bg-gray-100' : 'bg-white'}`}>
              <SelectValue placeholder="Pays de destination" />
            </SelectTrigger>
            <SelectContent>
              {departureCountry === "FR" ? (
                <>
                  <SelectItem value="TN">Tunisie</SelectItem>
                  <SelectItem value="DZ">Algérie</SelectItem>
                  <SelectItem value="MA">Maroc</SelectItem>
                </>
              ) : (
                <SelectItem value="FR">France</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-center">
        <ArrowLeftRight className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
}