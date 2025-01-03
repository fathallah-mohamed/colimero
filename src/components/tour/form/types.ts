export interface RoutePoint {
  name: string;
  location: string;
  time: string;
  type: "pickup";
  collection_date: string;
}

export interface TourFormValues {
  departure_country: string;
  destination_country: string;
  total_capacity: number;
  remaining_capacity: number;
  type: "public" | "private";
  departure_date: Date;
  route: RoutePoint[];
  terms_accepted: boolean;
  customs_declaration: boolean;
}