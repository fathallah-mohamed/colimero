import { Json } from "@/integrations/supabase/types";

export interface RouteStopJson {
  name: Json;
  location: Json;
  time: Json;
  type: Json;
  collection_date?: Json;
}

export interface RouteStop {
  name: string;
  location: string;
  time: string;
  type: "pickup" | "dropoff" | "ramassage" | "livraison";
  collection_date?: string;
}