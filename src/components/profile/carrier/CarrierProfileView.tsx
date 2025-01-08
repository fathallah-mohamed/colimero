import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CarrierProfileForm } from "./CarrierProfileForm";
import { ProfileHeader } from "../ProfileHeader";
import { ServicesSection } from "../ServicesSection";
import { CommitmentsSection } from "../CommitmentsSection";
import { Profile } from "@/types/profile";
import { TransporteurHeader } from "@/components/transporteur/TransporteurHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, MapPin, Phone } from "lucide-react";

interface CarrierProfileViewProps {
  profile: Profile;
}

export function CarrierProfileView({ profile }: CarrierProfileViewProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  return (
    <div className="space-y-6">
      <TransporteurHeader
        name={profile.company_name || ""}
        coverageArea={profile.coverage_area?.join(" ↔ ") || ""}
        avatarUrl={profile.avatar_url}
        firstName={profile.first_name}
      />

      <div className="max-w-7xl mx-auto px-4">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="capacities">Capacités</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="bg-white shadow rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-semibold">Contact</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p>{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p>{profile.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Adresse</p>
                    <p>{profile.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="services">
            <ServicesSection profile={profile} />
          </TabsContent>

          <TabsContent value="capacities">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Capacités et Tarifs</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3V21M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Capacité totale</p>
                    <p className="font-medium">1000 kg</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Prix par kilo</p>
                    <p className="font-medium">5€/kg</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl">
            <CarrierProfileForm
              initialData={profile}
              onClose={() => setShowEditDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}