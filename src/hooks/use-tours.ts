import { useTourFilters } from "./use-tour-filters";
import { useTourManagement } from "./use-tour-management";
import { useTourData } from "./use-tour-data";

export function useTours(carrierOnly: boolean = false) {
  const {
    selectedRoute,
    selectedStatus,
    tourType,
    sortBy,
    setSelectedRoute,
    setSelectedStatus,
    setTourType,
    setSortBy,
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

  const departureCountry = selectedRoute.split('_TO_')[0];
  const destinationCountry = selectedRoute.split('_TO_')[1];

  const { loading, tours, error } = useTourData({
    departureCountry,
    destinationCountry,
    sortBy,
    status: selectedStatus,
    carrierOnly,
    tourType
  });

  return {
    loading,
    tours,
    error,
    selectedTour,
    isEditDialogOpen,
    selectedRoute,
    selectedStatus,
    tourType,
    sortBy,
    setSelectedRoute,
    setSelectedStatus,
    setTourType,
    setSortBy,
    setIsEditDialogOpen,
    handleDelete,
    handleEdit,
    handleStatusChange,
    onEditComplete,
  };
}