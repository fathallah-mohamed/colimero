import { useTourFilters } from "./use-tour-filters";
import { useTourManagement } from "./use-tour-management";
import { useTourData } from "./use-tour-data";

export function useTours() {
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

  const { loading, tours } = useTourData({
    departureCountry,
    destinationCountry,
    sortBy,
    status,
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