export interface MenuItem {
  name: string;
  href: string;
  highlight?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}