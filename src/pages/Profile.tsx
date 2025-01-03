import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DeleteAccountButton } from "@/components/profile/DeleteAccountButton";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ClientProfileForm } from "@/components/profile/ClientProfileForm";
import { ClientProfileView } from "@/components/profile/ClientProfileView";
import { CarrierProfileView } from "@/components/profile/CarrierProfileView";
import { AdminProfileView } from "@/components/profile/AdminProfileView";
import { ProfileLoading } from "@/components/profile/ProfileLoading";
import { ProfileNotFound } from "@/components/profile/ProfileNotFound";
import { useProfile } from "@/hooks/use-profile";

export default function Profile() {
  const { profile, loading, userType, fetchProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <ProfileLoading />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <ProfileNotFound />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <ProfileHeader onEdit={() => setIsEditing(true)} />

            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Modifier mon profil</DialogTitle>
                </DialogHeader>
                {userType === 'carrier' ? (
                  <ProfileForm 
                    initialData={profile} 
                    onClose={() => {
                      setIsEditing(false);
                      fetchProfile();
                    }} 
                  />
                ) : userType === 'admin' ? (
                  <ProfileForm 
                    initialData={profile} 
                    onClose={() => {
                      setIsEditing(false);
                      fetchProfile();
                    }} 
                  />
                ) : (
                  <ClientProfileForm 
                    initialData={profile} 
                    onClose={() => {
                      setIsEditing(false);
                      fetchProfile();
                    }} 
                  />
                )}
              </DialogContent>
            </Dialog>

            {userType === 'carrier' ? (
              <CarrierProfileView profile={profile} />
            ) : userType === 'admin' ? (
              <AdminProfileView profile={profile} />
            ) : (
              <ClientProfileView profile={profile} />
            )}

            {/* Only show delete button for clients */}
            {userType === 'client' && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <DeleteAccountButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}