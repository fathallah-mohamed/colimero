import { useState } from "react";
import type { TourStatus } from "@/types/tour";

export function useTourFilters() {
  const [selectedRoute, setSelectedRoute] = useState("FR_TO_TN");
  const [selectedStatus, setSelectedStatus] = useState<TourStatus | "all">("Programmée");
  const [tourType, setTourType] = useState<"public" | "private">("public");
  const [sortBy, setSortBy] = useState("departure_asc");

  return {
    selectedRoute,
    selectedStatus,
    tourType,
    sortBy,
    setSelectedRoute,
    setSelectedStatus,
    setTourType,
    setSortBy,
  };
}