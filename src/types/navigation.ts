export type UserType = 'client' | 'carrier' | 'admin' | null;

export interface NavigationState {
  isOpen: boolean;
  user: any;
  userType: UserType;
  setIsOpen: (value: boolean) => void;
  handleLogout: () => Promise<void>;
  handleAuthDialogOpen: () => void;
}