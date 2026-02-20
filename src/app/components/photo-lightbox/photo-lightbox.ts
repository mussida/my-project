import {
  Component,
  input,
  output,
  signal,
  computed,
  HostListener,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Photo } from '../../models/desktop-icon.model';

@Component({
  selector: 'app-photo-lightbox',
  templateUrl: './photo-lightbox.html',
  styleUrl: './photo-lightbox.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoLightbox implements OnInit, OnDestroy {
  readonly photos = input.required<Photo[]>();
  readonly startIndex = input(0);

  readonly closed = output<void>();

  protected readonly currentIndex = signal(0);
  protected readonly isLoading = signal(true);
  protected readonly isZoomed = signal(false);

  protected readonly currentPhoto = computed(() => this.photos()[this.currentIndex()]);

  protected readonly hasNext = computed(() => this.currentIndex() < this.photos().length - 1);

  protected readonly hasPrev = computed(() => this.currentIndex() > 0);

  protected readonly counter = computed(() =>
    `${this.currentIndex() + 1} / ${this.photos().length}`
  );

  // Touch/swipe state
  private touchStartX = 0;
  private touchStartY = 0;

  ngOnInit(): void {
    this.currentIndex.set(this.startIndex());
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        this.next();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        this.prev();
        break;
      case 'Escape':
        this.close();
        break;
    }
  }

  next(): void {
    if (this.hasNext()) {
      this.isLoading.set(true);
      this.isZoomed.set(false);
      this.currentIndex.update((i) => i + 1);
    }
  }

  prev(): void {
    if (this.hasPrev()) {
      this.isLoading.set(true);
      this.isZoomed.set(false);
      this.currentIndex.update((i) => i - 1);
    }
  }

  close(): void {
    this.closed.emit();
  }

  onImageLoad(): void {
    this.isLoading.set(false);
  }

  toggleZoom(): void {
    this.isZoomed.update((z) => !z);
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('lightbox__image-container')) {
      this.close();
    }
  }

  // ─── Touch/swipe support ───

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  onTouchEnd(event: TouchEvent): void {
    const dx = event.changedTouches[0].clientX - this.touchStartX;
    const dy = event.changedTouches[0].clientY - this.touchStartY;

    // Only handle horizontal swipes (ignore vertical scroll)
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }
}
