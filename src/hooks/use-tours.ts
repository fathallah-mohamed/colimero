import { useTourFilters } from "./use-tour-filters";
import { useTourManagement } from "./use-tour-management";

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

  return {
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