import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@supabase/auth-helpers-react";
import Navigation from "@/components/Navigation";
import { ApprovalRequestsList } from "@/components/approval-requests/ApprovalRequestsList";

export default function MesDemandesApprobation() {
  const navigate = useNavigate();
  const user = useUser();

  useEffect(() => {
    if (!user) {
      navigate('/connexion');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Mes demandes d'approbation</h1>
        <ApprovalRequestsList />
      </div>
    </div>
  );
}