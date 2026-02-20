import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { Album, Photo } from '../models/desktop-icon.model';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  // Cache albums observable so we don't re-fetch on every navigation
  private albumsCache$: Observable<Album[]> | null = null;

  /**
   * Fetch all albums from Cloudinary via our proxy.
   * Results are cached in memory until page reload.
   */
  getAlbums(): Observable<Album[]> {
    if (!this.albumsCache$) {
      this.albumsCache$ = this.http.get<Album[]>(`${this.apiUrl}/api/albums`).pipe(
        shareReplay(1)
      );
    }
    return this.albumsCache$;
  }

  /**
   * Fetch all photos in a specific album.
   */
  getPhotosByAlbum(albumId: string): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.apiUrl}/api/albums/${albumId}/photos`);
  }

  /**
   * Invalidate the albums cache (e.g. after a pull-to-refresh).
   */
  refreshAlbums(): void {
    this.albumsCache$ = null;
  }
}
