import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ExplorerWindow } from '../../components/explorer-window/explorer-window';
import { ExplorerGrid } from '../../components/explorer-grid/explorer-grid';
import { GalleryService } from '../../services/gallery.service';
import { Album, Photo, BreadcrumbItem } from '../../models/desktop-icon.model';

@Component({
  selector: 'app-archive-page',
  imports: [ExplorerWindow, ExplorerGrid],
  templateUrl: './archive-page.html',
  styleUrl: './archive-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchivePage {
  private readonly router = inject(Router);
  private readonly gallery = inject(GalleryService);

  protected readonly albums = signal<Album[]>(this.gallery.getAlbums());
  protected readonly currentAlbum = signal<Album | null>(null);
  protected readonly currentPhotos = signal<Photo[]>([]);

  protected readonly viewMode = computed(() =>
    this.currentAlbum() ? 'photos' as const : 'albums' as const
  );

  protected readonly windowTitle = computed(() =>
    this.currentAlbum()?.name ?? 'Archive'
  );

  protected readonly breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const items: BreadcrumbItem[] = [
      { label: 'Archive', route: this.currentAlbum() ? '/archive' : null },
    ];

    const album = this.currentAlbum();
    if (album) {
      items.push({ label: album.name, route: null });
    }

    return items;
  });

  protected readonly statusText = computed(() => {
    const album = this.currentAlbum();
    if (album) {
      return `${this.currentPhotos().length} elementi`;
    }
    return `${this.albums().length} elementi`;
  });

  onAlbumOpened(album: Album): void {
    this.currentAlbum.set(album);
    this.currentPhotos.set(this.gallery.getPhotosByAlbum(album.id));
  }

  onBreadcrumbClicked(item: BreadcrumbItem): void {
    if (item.label === 'Archive') {
      this.goToAlbumList();
    }
  }

  onBackClicked(): void {
    if (this.currentAlbum()) {
      this.goToAlbumList();
    } else {
      this.router.navigate(['/']);
    }
  }

  onWindowClosed(): void {
    this.router.navigate(['/']);
  }

  onPhotoOpened(photo: Photo): void {
    // TODO: open photo lightbox/viewer
    console.log('Open photo:', photo);
  }

  private goToAlbumList(): void {
    this.currentAlbum.set(null);
    this.currentPhotos.set([]);
  }
}
