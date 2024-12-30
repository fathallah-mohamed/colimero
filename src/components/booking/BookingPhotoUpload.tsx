import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface BookingPhotoUploadProps {
  photos: File[];
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BookingPhotoUpload({ photos, onPhotoUpload }: BookingPhotoUploadProps) {
  return (
    <div className="space-y-2">
      <Label>Photos et Vidéos</Label>
      <div className="border-2 border-dashed rounded-lg p-4 text-center">
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={onPhotoUpload}
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
                src={URL.createObjectURL(photo)}
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