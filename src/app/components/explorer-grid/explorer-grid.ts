import { Component, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { Album, Photo } from '../../models/desktop-icon.model';

@Component({
  selector: 'app-explorer-grid',
  templateUrl: './explorer-grid.html',
  styleUrl: './explorer-grid.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExplorerGrid {
  readonly albums = input<Album[]>([]);
  readonly photos = input<Photo[]>([]);
  readonly viewMode = input<'albums' | 'photos'>('albums');

  readonly albumOpened = output<Album>();
  readonly photoOpened = output<Photo>();

  protected readonly selectedId = signal<string | null>(null);

  private lastClickTime = 0;
  private lastClickId = '';

  /**
   * Unified click handler — acts as both single and double click.
   * On mobile (no dblclick), two fast taps trigger open.
   * On any device, a single tap selects, rapid second tap opens.
   */
  onAlbumClick(album: Album): void {
    const now = Date.now();
    if (this.lastClickId === album.id && now - this.lastClickTime < 500) {
      // Double tap / double click → open
      this.albumOpened.emit(album);
      this.lastClickTime = 0;
      this.lastClickId = '';
    } else {
      // Single tap → select
      this.selectedId.set(album.id);
      this.lastClickTime = now;
      this.lastClickId = album.id;
    }
  }

  onPhotoClick(photo: Photo, index: number): void {
    const now = Date.now();
    if (this.lastClickId === photo.id && now - this.lastClickTime < 500) {
      this.photoOpened.emit(photo);
      this.lastClickTime = 0;
      this.lastClickId = '';
    } else {
      this.selectedId.set(photo.id);
      this.lastClickTime = now;
      this.lastClickId = photo.id;
    }
  }

  // Desktop double-click as backup
  onAlbumDblClick(album: Album): void {
    this.albumOpened.emit(album);
  }

  onPhotoDblClick(photo: Photo): void {
    this.photoOpened.emit(photo);
  }
}
