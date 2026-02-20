import { Component, signal, computed, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { DraggableWindow } from '../../components/draggable-window/draggable-window';
import { ExplorerWindow } from '../../components/explorer-window/explorer-window';
import { ExplorerGrid } from '../../components/explorer-grid/explorer-grid';
import { PhotoLightbox } from '../../components/photo-lightbox/photo-lightbox';
import { Taskbar } from '../../components/taskbar/taskbar';
import { GalleryService } from '../../services/gallery.service';
import { Album, Photo, BreadcrumbItem } from '../../models/desktop-icon.model';

@Component({
  selector: 'app-archive-page',
  imports: [DraggableWindow, ExplorerWindow, ExplorerGrid, PhotoLightbox, Taskbar],
  templateUrl: './archive-page.html',
  styleUrl: './archive-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchivePage implements OnInit {
  private readonly router = inject(Router);
  private readonly gallery = inject(GalleryService);

  protected readonly albums = signal<Album[]>([]);
  protected readonly currentAlbum = signal<Album | null>(null);
  protected readonly currentPhotos = signal<Photo[]>([]);
  protected readonly loading = signal(true);
  protected readonly loadingPhotos = signal(false);

  // Lightbox state
  protected readonly lightboxOpen = signal(false);
  protected readonly lightboxStartIndex = signal(0);

  protected readonly viewMode = computed(() =>
    this.currentAlbum() ? ('photos' as const) : ('albums' as const)
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
    if (this.loading() || this.loadingPhotos()) return 'Caricamento...';
    const album = this.currentAlbum();
    if (album) {
      return `${this.currentPhotos().length} elementi`;
    }
    return `${this.albums().length} album`;
  });

  ngOnInit(): void {
    this.gallery.getAlbums().subscribe({
      next: (albums) => {
        this.albums.set(albums);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load albums:', err);
        this.loading.set(false);
      },
    });
  }

  onAlbumOpened(album: Album): void {
    this.currentAlbum.set(album);
    this.loadingPhotos.set(true);

    this.gallery.getPhotosByAlbum(album.id).subscribe({
      next: (photos) => {
        this.currentPhotos.set(photos);
        this.loadingPhotos.set(false);
      },
      error: (err) => {
        console.error('Failed to load photos:', err);
        this.loadingPhotos.set(false);
      },
    });
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
    const photos = this.currentPhotos();
    const index = photos.findIndex((p) => p.id === photo.id);
    this.lightboxStartIndex.set(index >= 0 ? index : 0);
    this.lightboxOpen.set(true);
  }

  onLightboxClosed(): void {
    this.lightboxOpen.set(false);
  }

  private goToAlbumList(): void {
    this.currentAlbum.set(null);
    this.currentPhotos.set([]);
  }
}
