import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface BookingPhotoUploadProps {
  photos: (File | string)[];
  onPhotosChange: (photos: string[]) => void;
}

export function BookingPhotoUpload({ photos, onPhotosChange }: BookingPhotoUploadProps) {
  return (
    <div className="space-y-2">
      <Label>Photos et Vidéos</Label>
      <div className="border-2 border-dashed rounded-lg p-4 text-center">
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            Promise.all(
              files.map((file) => {
                return new Promise<string>((resolve) => {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    resolve(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                });
              })
            ).then((photoUrls) => {
              onPhotosChange(photoUrls);
            });
          }}
          className="hidden"
          id="photo-upload"
        />
        <label
          htmlFor="photo-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <Upload className="h-6 w-6 text-gray-400 mb-2" />
          <span className="text-sm text-gray-600">Ajouter des médias</span>
        </label>
      </div>
      {photos.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {photos.map((photo, index) => (
            <div key={index} className="relative">
              <img
                src={typeof photo === 'string' ? photo : URL.createObjectURL(photo)}
                alt={`Upload ${index + 1}`}
                className="h-16 w-16 object-cover rounded"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}