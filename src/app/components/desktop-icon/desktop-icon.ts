import { Component, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { DesktopIconConfig } from '../../models/desktop-icon.model';

@Component({
  selector: 'app-desktop-icon',
  templateUrl: './desktop-icon.html',
  styleUrl: './desktop-icon.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesktopIcon {
  readonly config = input.required<DesktopIconConfig>();
  readonly selected = input(false);
  readonly animationDelay = input('0s');

  readonly iconClicked = output<DesktopIconConfig>();
  readonly iconDblClicked = output<DesktopIconConfig>();

  protected readonly opening = signal(false);

  private lastClickTime = 0;

  /**
   * Unified click handler for both desktop and mobile.
   * Two rapid taps within 500ms = open (double click).
   */
  onClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const now = Date.now();
    if (now - this.lastClickTime < 500) {
      // Double tap → open
      this.opening.set(true);
      this.iconDblClicked.emit(this.config());
      setTimeout(() => this.opening.set(false), 400);
      this.lastClickTime = 0;
    } else {
      // Single tap → select
      this.iconClicked.emit(this.config());
      this.lastClickTime = now;
    }
  }

  onDblClick(event: MouseEvent): void {
    event.preventDefault();
    this.opening.set(true);
    this.iconDblClicked.emit(this.config());
    setTimeout(() => this.opening.set(false), 400);
  }
}
