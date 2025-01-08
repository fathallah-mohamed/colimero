// Routes that don't require authentication
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

// Routes that start with these prefixes are also public
export const PUBLIC_ROUTE_PREFIXES = [
  '/envoyer-colis/',
  '/planifier-tournee/',
  '/transporteurs/'
] as const;

export const isPublicRoute = (pathname: string): boolean => {
  // Check exact matches first
  if (PUBLIC_ROUTES.includes(pathname as any)) {
    return true;
  }
  
  // Then check prefixes
  return PUBLIC_ROUTE_PREFIXES.some(prefix => pathname.startsWith(prefix));
};