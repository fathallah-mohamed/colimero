import { useState } from "react";
import { useTourFilters } from "./use-tour-filters";
import { useTourManagement } from "./use-tour-management";
import { useTourData } from "./use-tour-data";

export function useTours(carrierOnly: boolean = false) {
  const {
    departureCountry,
    destinationCountry,
    sortBy,
    status,
    setDepartureCountry,
    setDestinationCountry,
    setSortBy,
    setStatus,
  } = useTourFilters();

  const {
    selectedTour,
    isEditDialogOpen,
    setIsEditDialogOpen,
    handleDelete,
    handleEdit,
    handleStatusChange,
    onEditComplete,
  } = useTourManagement();

  const { loading, tours, fetchTours } = useTourData({
    departureCountry,
    destinationCountry,
    sortBy,
    status,
    carrierOnly
  });

  console.log('useTours hook state:', {
    departureCountry,
    destinationCountry,
    sortBy,
    status,
    toursCount: tours.length,
    carrierOnly
  });

  return {
    loading,
    tours,
    selectedTour,
    isEditDialogOpen,
    departureCountry,
    destinationCountry,
    sortBy,
    status,
    setDepartureCountry,
    setDestinationCountry,
    setSortBy,
    setStatus,
    setIsEditDialogOpen,
    handleDelete,
    handleEdit,
    handleStatusChange,
    onEditComplete,
  };
}