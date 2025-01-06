import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Tour, TourStatus } from "@/types/tour";
import { useTourFilters } from "./use-tour-filters";
import { useTourManagement } from "./use-tour-management";
import { useTourData } from "./use-tour-data";

export function useTours() {
  const navigate = useNavigate();
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
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/connexion');
      }
    };

    checkAuth();
  }, [navigate]);

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