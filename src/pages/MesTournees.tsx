import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function MesTournees() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState<any[]>([]);

  useEffect(() => {
    checkUser();
    fetchTours();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/connexion');
    }
  };

  const fetchTours = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('carrier_id', session.user.id)
        .order('departure_date', { ascending: true });

      if (error) {
        console.error('Error fetching tours:', error);
        return;
      }

      setTours(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Mes tournées</h1>
        <div className="grid gap-6">
          {tours.map((tour) => (
            <div key={tour.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">
                    {tour.departure_country} → {tour.destination_country}
                  </h2>
                  <p className="text-gray-600">
                    Départ : {new Date(tour.departure_date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    Capacité restante : {tour.remaining_capacity} kg
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  tour.type === 'public' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {tour.type === 'public' ? 'Public' : 'Privé'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}