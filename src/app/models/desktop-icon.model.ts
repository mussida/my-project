export interface DesktopIconConfig {
  id: string;
  label: string;
  tooltip: string;
  route: string;
  iconType: 'archive' | 'blog' | 'about' | 'bin';
  position?: 'auto' | 'bottom-right';
}

export interface Album {
  id: string;
  name: string;
  coverUrl: string;
  photoCount: number;
  date: string;
}

export interface Photo {
  id: string;
  url: string;
  thumbnailUrl: string;
  name: string;
  width: number;
  height: number;
}

export interface BreadcrumbItem {
  label: string;
  route: string | null;
}

export interface WindowState {
  x: number;
  y: number;
  width: number;
  height: number;
  isMaximized: boolean;
  isMinimized: boolean;
}
