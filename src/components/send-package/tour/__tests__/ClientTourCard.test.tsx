import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ClientTourCard } from '../ClientTourCard';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { supabase } from "@/integrations/supabase/client";
import type { Tour } from "@/types/tour";

// Mock Supabase
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: vi.fn()
    }
  }
}));

// Mock useToast
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

const mockTour: Tour = {
  id: 1,
  carrier_id: "123",
  type: "public",
  status: "Programmée",
  departure_date: "2024-04-01",
  collection_date: "2024-03-30",
  departure_country: "FR",
  destination_country: "TN",
  total_capacity: 1000,
  remaining_capacity: 800,
  created_at: "2024-03-01",
  updated_at: "2024-03-01",
  terms_accepted: true,
  customs_declaration: true,
  route: [
    {
      name: "Paris",
      location: "Gare de Lyon",
      time: "08:00",
      type: "pickup"
    },
    {
      name: "Lyon",
      location: "Gare Part-Dieu",
      time: "10:00",
      type: "pickup"
    }
  ],
  carriers: {
    company_name: "Test Transport",
    avatar_url: "test.jpg",
    carrier_capacities: {
      price_per_kg: 10
    }
  }
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ClientTourCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders tour basic information correctly', () => {
    renderWithRouter(<ClientTourCard tour={mockTour} />);
    
    expect(screen.getByText('Test Transport')).toBeInTheDocument();
    expect(screen.getByText('10 €/kg')).toBeInTheDocument();
    expect(screen.getByText(/FR/)).toBeInTheDocument();
    expect(screen.getByText(/TN/)).toBeInTheDocument();
  });

  it('shows pickup points when expanded', async () => {
    renderWithRouter(<ClientTourCard tour={mockTour} />);
    
    // Click to expand
    const expandButton = screen.getByText(/Afficher les détails/i);
    fireEvent.click(expandButton);
    
    // Check if pickup points are displayed
    await waitFor(() => {
      expect(screen.getByText('Paris')).toBeInTheDocument();
      expect(screen.getByText('Lyon')).toBeInTheDocument();
    });
  });

  it('requires pickup city selection before booking', async () => {
    // Mock session
    (supabase.auth.getSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { session: { user: { user_metadata: { user_type: 'client' } } } }
    });

    renderWithRouter(<ClientTourCard tour={mockTour} />);
    
    // Expand card
    const expandButton = screen.getByText(/Afficher les détails/i);
    fireEvent.click(expandButton);
    
    // Try to book without selecting pickup city
    const bookButton = await screen.findByText(/Sélectionnez un point de collecte/i);
    expect(bookButton).toBeDisabled();
  });

  it('handles private tour approval request correctly', async () => {
    const privateTour: Tour = { ...mockTour, type: "private" };
    
    // Mock authenticated session
    (supabase.auth.getSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { session: { user: { user_metadata: { user_type: 'client' } } } }
    });

    renderWithRouter(<ClientTourCard tour={privateTour} />);
    
    // Expand card
    const expandButton = screen.getByText(/Afficher les détails/i);
    fireEvent.click(expandButton);
    
    // Select pickup city
    const parisOption = await screen.findByText('Paris');
    fireEvent.click(parisOption);
    
    // Check if approval button is shown instead of direct booking
    expect(screen.getByText(/Demander l'approbation/i)).toBeInTheDocument();
  });
});