import { Component, input, output, signal, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { DesktopIcon } from '../desktop-icon/desktop-icon';
import { DesktopIconConfig } from '../../models/desktop-icon.model';

@Component({
  selector: 'app-desktop',
  imports: [DesktopIcon],
  templateUrl: './desktop.html',
  styleUrl: './desktop.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Desktop {
  readonly icons = input.required<DesktopIconConfig[]>();

  readonly iconOpened = output<DesktopIconConfig>();

  protected readonly selectedIconId = signal<string | null>(null);

  // Selection rectangle state
  protected readonly selectionVisible = signal(false);
  protected readonly selectionRect = signal({ left: 0, top: 0, width: 0, height: 0 });
  private dragStartX = 0;
  private dragStartY = 0;
  private isDragging = false;

  onIconClicked(config: DesktopIconConfig): void {
    this.selectedIconId.set(config.id);
  }

  onIconDblClicked(config: DesktopIconConfig): void {
    this.iconOpened.emit(config);
  }

  onDesktopClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('app-desktop-icon')) {
      this.selectedIconId.set(null);
    }
  }

  onDesktopMouseDown(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest('app-desktop-icon') || event.button !== 0) return;

    this.isDragging = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.selectionRect.set({ left: event.clientX, top: event.clientY, width: 0, height: 0 });
    this.selectionVisible.set(true);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;

    const x = Math.min(event.clientX, this.dragStartX);
    const y = Math.min(event.clientY, this.dragStartY);
    const w = Math.abs(event.clientX - this.dragStartX);
    const h = Math.abs(event.clientY - this.dragStartY);

    this.selectionRect.set({ left: x, top: y, width: w, height: h });
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.isDragging = false;
    this.selectionVisible.set(false);
  }

  getAnimationDelay(index: number): string {
    return `${0.1 + index * 0.08}s`;
  }

  isSelected(id: string): boolean {
    return this.selectedIconId() === id;
  }
}
