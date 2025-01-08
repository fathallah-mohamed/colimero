import { Route } from "@/types/navigation";

export const PUBLIC_ROUTES = [
  '/',
  '/connexion',
  '/login',
  '/envoyer-colis',
  '/planifier-tournee',
  '/transporteurs',
  '/blog',
  '/a-propos',
  '/contact'
] as const;

export const PUBLIC_ROUTE_PREFIXES = [
  '/envoyer-colis/',
  '/planifier-tournee/',
  '/transporteurs/',
  '/reserver/'
] as const;

export const isPublicRoute = (pathname: string): boolean => {
  console.log('Checking if route is public:', pathname);
  
  // Check exact matches first
  if (PUBLIC_ROUTES.includes(pathname as any)) {
    console.log('Route is public (exact match)');
    return true;
  }
  
  // Then check prefixes
  const isPublicPrefix = PUBLIC_ROUTE_PREFIXES.some(prefix => pathname.startsWith(prefix));
  console.log('Route is public (prefix match):', isPublicPrefix);
  return isPublicPrefix;
};