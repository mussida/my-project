import {
  Component,
  input,
  output,
  signal,
  computed,
  ElementRef,
  inject,
  OnInit,
  AfterViewInit,
  HostListener,
  ChangeDetectionStrategy,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { WindowState } from '../../models/desktop-icon.model';

@Component({
  selector: 'app-draggable-window',
  templateUrl: './draggable-window.html',
  styleUrl: './draggable-window.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DraggableWindow implements OnInit, AfterViewInit {
  readonly title = input('Window');
  readonly initialWidth = input(960);
  readonly initialHeight = input(640);
  readonly minWidth = input(400);
  readonly minHeight = input(300);

  readonly closed = output<void>();
  readonly minimized = output<void>();

  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly isMobile = signal(false);

  // Window state
  protected readonly state = signal<WindowState>({
    x: 0,
    y: 0,
    width: 960,
    height: 640,
    isMaximized: false,
    isMinimized: false,
  });

  // Pre-maximize state for restore
  private preMaxState: Partial<WindowState> = {};

  // Drag state
  private isDragging = false;
  private dragOffsetX = 0;
  private dragOffsetY = 0;

  // Resize state
  private isResizing = false;
  private resizeDirection = '';
  private resizeStartX = 0;
  private resizeStartY = 0;
  private resizeStartState: Partial<WindowState> = {};

  protected readonly windowStyle = computed(() => {
    const s = this.state();
    if (s.isMaximized || this.isMobile()) {
      return {
        left: '0px',
        top: '0px',
        width: '100%',
        height: '100%',
        borderRadius: '0px',
      };
    }
    return {
      left: `${s.x}px`,
      top: `${s.y}px`,
      width: `${s.width}px`,
      height: `${s.height}px`,
      borderRadius: '8px',
    };
  });

  protected readonly isMaximized = computed(() => this.state().isMaximized || this.isMobile());

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkMobile();
    }
  }

  ngAfterViewInit(): void {
    // Re-check after view init for accurate dimensions on iOS
    if (isPlatformBrowser(this.platformId)) {
      requestAnimationFrame(() => this.checkMobile());
    }
  }

  private checkMobile(): void {
    // Use multiple checks for reliable mobile detection
    const vw = window.innerWidth;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = vw <= 768;
    const mobile = isSmallScreen || (isTouchDevice && vw <= 1024);

    this.isMobile.set(mobile);

    if (mobile) {
      this.state.set({
        x: 0,
        y: 0,
        width: vw,
        height: window.innerHeight,
        isMaximized: true,
        isMinimized: false,
      });
    } else {
      const vh = window.innerHeight;
      const w = Math.min(this.initialWidth(), vw - 48);
      const h = Math.min(this.initialHeight(), vh - 96);
      this.state.set({
        x: Math.round((vw - w) / 2),
        y: Math.round((vh - h) / 2) - 24,
        width: w,
        height: h,
        isMaximized: false,
        isMinimized: false,
      });
    }
  }

  // ─── Title bar drag ───

  onTitlebarMouseDown(event: MouseEvent): void {
    if (this.isMobile() || this.state().isMaximized) return;
    if ((event.target as HTMLElement).closest('.titlebar-btn')) return;

    this.isDragging = true;
    const s = this.state();
    this.dragOffsetX = event.clientX - s.x;
    this.dragOffsetY = event.clientY - s.y;
    event.preventDefault();
  }

  onTitlebarTouchStart(event: TouchEvent): void {
    if (this.isMobile() || this.state().isMaximized) return;
    if ((event.target as HTMLElement).closest('.titlebar-btn')) return;

    const touch = event.touches[0];
    this.isDragging = true;
    const s = this.state();
    this.dragOffsetX = touch.clientX - s.x;
    this.dragOffsetY = touch.clientY - s.y;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      this.handleDragMove(event.clientX, event.clientY);
    }
    if (this.isResizing) {
      this.handleResizeMove(event.clientX, event.clientY);
    }
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    const touch = event.touches[0];
    if (this.isDragging) {
      this.handleDragMove(touch.clientX, touch.clientY);
    }
    if (this.isResizing) {
      this.handleResizeMove(touch.clientX, touch.clientY);
    }
  }

  @HostListener('document:mouseup')
  @HostListener('document:touchend')
  onPointerUp(): void {
    this.isDragging = false;
    this.isResizing = false;
  }

  private handleDragMove(clientX: number, clientY: number): void {
    const newX = Math.max(0, clientX - this.dragOffsetX);
    const newY = Math.max(0, clientY - this.dragOffsetY);
    this.state.update((s) => ({ ...s, x: newX, y: newY }));
  }

  // ─── Resize ───

  onResizeStart(event: MouseEvent, direction: string): void {
    if (this.isMobile() || this.state().isMaximized) return;
    this.isResizing = true;
    this.resizeDirection = direction;
    this.resizeStartX = event.clientX;
    this.resizeStartY = event.clientY;
    const s = this.state();
    this.resizeStartState = { x: s.x, y: s.y, width: s.width, height: s.height };
    event.preventDefault();
    event.stopPropagation();
  }

  private handleResizeMove(clientX: number, clientY: number): void {
    const dx = clientX - this.resizeStartX;
    const dy = clientY - this.resizeStartY;
    const ss = this.resizeStartState;
    const minW = this.minWidth();
    const minH = this.minHeight();

    this.state.update((s) => {
      const next = { ...s };

      if (this.resizeDirection.includes('e')) {
        next.width = Math.max(minW, (ss.width ?? s.width) + dx);
      }
      if (this.resizeDirection.includes('w')) {
        const newW = Math.max(minW, (ss.width ?? s.width) - dx);
        next.x = (ss.x ?? s.x) + ((ss.width ?? s.width) - newW);
        next.width = newW;
      }
      if (this.resizeDirection.includes('s')) {
        next.height = Math.max(minH, (ss.height ?? s.height) + dy);
      }
      if (this.resizeDirection.includes('n')) {
        const newH = Math.max(minH, (ss.height ?? s.height) - dy);
        next.y = (ss.y ?? s.y) + ((ss.height ?? s.height) - newH);
        next.height = newH;
      }

      return next;
    });
  }

  // ─── Window controls ───

  toggleMaximize(): void {
    if (this.isMobile()) return;

    const s = this.state();
    if (s.isMaximized) {
      this.state.set({
        x: this.preMaxState.x ?? 100,
        y: this.preMaxState.y ?? 50,
        width: this.preMaxState.width ?? this.initialWidth(),
        height: this.preMaxState.height ?? this.initialHeight(),
        isMaximized: false,
        isMinimized: false,
      });
    } else {
      this.preMaxState = { x: s.x, y: s.y, width: s.width, height: s.height };
      this.state.set({
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight - 48,
        isMaximized: true,
        isMinimized: false,
      });
    }
  }

  onTitlebarDblClick(): void {
    if (!this.isMobile()) {
      this.toggleMaximize();
    }
  }

  onClose(): void {
    this.closed.emit();
  }

  onMinimize(): void {
    this.minimized.emit();
  }
}