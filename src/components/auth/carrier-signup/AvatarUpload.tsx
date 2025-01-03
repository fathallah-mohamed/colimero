import { useState } from "react";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./FormSchema";
import { supabase } from "@/integrations/supabase/client";

interface AvatarUploadProps {
  form: UseFormReturn<FormValues>;
}

export function AvatarUpload({ form }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      form.setValue("avatar_url", publicUrl);
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    const currentUrl = form.getValues("avatar_url");
    if (currentUrl) {
      const fileName = currentUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('avatars')
          .remove([fileName]);
      }
    }
    form.setValue("avatar_url", null);
    setPreview(null);
  };

  return (
    <FormField
      control={form.control}
      name="avatar_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Photo de profil</FormLabel>
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={preview || field.value || ""} />
              <AvatarFallback className="bg-blue-500 text-white">
                <Upload className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="avatar-upload"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <Button
                type="button"
                variant="outline"
                disabled={isUploading}
                asChild
              >
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  {isUploading ? "Chargement..." : "Choisir une photo"}
                </label>
              </Button>
              {(preview || field.value) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  className="text-red-500"
                  disabled={isUploading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              )}
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}