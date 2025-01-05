import { useState } from "react";
import { TourCard } from "./TourCard";
import { Loader2 } from "lucide-react";
import AuthDialog from "@/components/auth/AuthDialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { RegisterForm } from "@/components/auth/RegisterForm";
import type { Tour } from "@/types/tour";

interface TransporteurToursProps {
  tours: Tour[];
  type: "public" | "private";
  isLoading: boolean;
  userType: string | null;
}

export function TransporteurTours({ tours, type, isLoading, userType }: TransporteurToursProps) {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!tours.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucune tournée {type === "public" ? "publique" : "privée"} disponible
      </div>
    );
  }

  const handleRegisterClick = () => {
    setShowAuthDialog(false);
    setShowRegisterForm(true);
  };

  return (
    <div className="grid gap-6">
      {tours.map((tour) => (
        <TourCard
          key={tour.id}
          tour={tour}
          userType={userType}
          onAuthRequired={() => setShowAuthDialog(true)}
        />
      ))}

      <AuthDialog 
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        requiredUserType="client"
        onRegisterClick={handleRegisterClick}
      />

      <Dialog open={showRegisterForm} onOpenChange={setShowRegisterForm}>
        <DialogContent className="max-w-2xl">
          <RegisterForm onLogin={() => {
            setShowRegisterForm(false);
            setShowAuthDialog(true);
          }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}