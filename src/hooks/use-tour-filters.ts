import { useState } from "react";
import type { TourStatus } from "@/types/tour";

export function useTourFilters() {
  const [departureCountry, setDepartureCountry] = useState("FR");
  const [destinationCountry, setDestinationCountry] = useState("TN");
  const [sortBy, setSortBy] = useState("departure_asc");
  const [status, setStatus] = useState<TourStatus | "all">("planned");

  return {
    departureCountry,
    destinationCountry,
    sortBy,
    status,
    setDepartureCountry,
    setDestinationCountry,
    setSortBy,
    setStatus,
  };
}