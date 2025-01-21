import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export function usePhotoUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadPhotos = async (photos: File[]): Promise<string[]> => {
    if (!photos.length) return [];
    
    setIsUploading(true);
    try {
      const uploadPromises = photos.map(async (photo) => {
        const fileExt = photo.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('bookings')
          .upload(filePath, photo);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('bookings')
          .getPublicUrl(filePath);

        return publicUrl;
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement des photos.",
      });
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadPhotos,
    isUploading
  };
}