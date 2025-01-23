import type { Json } from "@/integrations/supabase/types";
import type { RouteStop, RouteStopJson } from "@/types/tour/route";

export function parseRouteStop(stop: { [key: string]: Json } | Json[]): RouteStop {
  const stopData = stop as unknown as RouteStopJson;
  
  return {
    name: String(stopData.name || ''),
    location: String(stopData.location || ''),
    time: String(stopData.time || ''),
    type: String(stopData.type || 'pickup') as RouteStop['type'],
    collection_date: stopData.collection_date ? String(stopData.collection_date) : undefined
  };
}

export function parseRouteData(routeData: Json): RouteStop[] {
  if (!Array.isArray(routeData)) {
    console.error('Invalid route data format:', routeData);
    return [];
  }

  return routeData.map(stop => parseRouteStop(stop));
}