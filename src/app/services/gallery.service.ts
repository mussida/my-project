import { Injectable, signal } from '@angular/core';
import { Album, Photo } from '../models/desktop-icon.model';

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  /**
   * Mock data — replace with Cloudinary API calls later.
   *
   * Cloudinary integration would look like:
   *   - List folders: GET https://api.cloudinary.com/v1_1/{cloud}/folders/archive
   *   - List images: GET with folder prefix search
   *   - Thumbnails: Add /c_thumb,w_300,h_200/ to URL
   */

  private readonly mockAlbums: Album[] = [
    {
      id: 'matrimonio-roma',
      name: 'Matrimonio Roma',
      coverUrl: 'https://picsum.photos/seed/album1/400/300',
      photoCount: 42,
      date: '2024-06-15',
    },
    {
      id: 'ritratti-studio',
      name: 'Ritratti Studio',
      coverUrl: 'https://picsum.photos/seed/album2/400/300',
      photoCount: 28,
      date: '2024-03-22',
    },
    {
      id: 'paesaggi-toscana',
      name: 'Paesaggi Toscana',
      coverUrl: 'https://picsum.photos/seed/album3/400/300',
      photoCount: 35,
      date: '2023-10-08',
    },
  ];

  getAlbums(): Album[] {
    return this.mockAlbums;
  }

  getAlbumById(id: string): Album | undefined {
    return this.mockAlbums.find((a) => a.id === id);
  }

  getPhotosByAlbum(albumId: string): Photo[] {
    // Generate mock photos for any album
    return Array.from({ length: 12 }, (_, i) => ({
      id: `${albumId}-${i}`,
      url: `https://picsum.photos/seed/${albumId}-${i}/1200/800`,
      thumbnailUrl: `https://picsum.photos/seed/${albumId}-${i}/300/200`,
      name: `IMG_${String(i + 1).padStart(4, '0')}`,
      width: 1200,
      height: 800,
    }));
  }
}
