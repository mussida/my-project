export interface DesktopIconConfig {
  id: string;
  label: string;
  tooltip: string;
  route: string;
  iconType: 'archive' | 'blog' | 'about' | 'bin';
  position?: 'auto' | 'bottom-right';
}
