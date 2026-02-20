import { Component, signal, HostListener, ChangeDetectionStrategy } from '@angular/core';

interface ContextMenuItem {
  label: string;
  icon: string;
  action?: () => void;
  dividerAfter?: boolean;
}

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.html',
  styleUrl: './context-menu.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenu {
  protected readonly visible = signal(false);
  protected readonly posX = signal(0);
  protected readonly posY = signal(0);

  protected readonly items: ContextMenuItem[] = [
    { label: 'View', icon: 'grid', dividerAfter: false },
    { label: 'Sort by', icon: 'sort', dividerAfter: true },
    { label: 'Refresh', icon: 'refresh', action: () => window.location.reload(), dividerAfter: true },
    { label: 'Display settings', icon: 'display' },
    { label: 'Personalise', icon: 'more' },
  ];

  @HostListener('document:contextmenu', ['$event'])
  onContextMenu(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Only show on desktop area
    if (target.closest('app-desktop-icon') || target.closest('app-taskbar')) {
      this.visible.set(false);
      return;
    }

    event.preventDefault();
    this.posX.set(Math.min(event.clientX, window.innerWidth - 220));
    this.posY.set(Math.min(event.clientY, window.innerHeight - 250));
    this.visible.set(true);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.visible.set(false);
  }

  onItemClick(item: ContextMenuItem): void {
    item.action?.();
    this.visible.set(false);
  }
}
