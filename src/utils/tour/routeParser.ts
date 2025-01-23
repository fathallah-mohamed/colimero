import type { Json } from "@/integrations/supabase/types";
import type { RouteStop, RouteStopJson } from "@/types/tour/route";

export function parseRouteStop(stop: { [key: string]: Json }): RouteStop {
  return {
    name: String(stop.name || ''),
    location: String(stop.location || ''),
    time: String(stop.time || ''),
    type: String(stop.type || 'pickup') as RouteStop['type'],
    collection_date: stop.collection_date ? String(stop.collection_date) : undefined
  };
}

export function parseRouteData(routeData: Json): RouteStop[] {
  if (!routeData || typeof routeData !== 'object') {
    console.error('Invalid route data format:', routeData);
    return [];
  }

  try {
    const parsedData = Array.isArray(routeData) ? routeData : JSON.parse(String(routeData));
    
    if (!Array.isArray(parsedData)) {
      console.error('Route data is not an array:', parsedData);
      return [];
    }

    return parsedData.map(stop => {
      if (typeof stop !== 'object' || !stop) {
        console.error('Invalid route stop:', stop);
        return {
          name: '',
          location: '',
          time: '',
          type: 'pickup',
          collection_date: undefined
        };
      }
      return parseRouteStop(stop as { [key: string]: Json });
    });
  } catch (error) {
    console.error('Error parsing route data:', error);
    return [];
  }
}