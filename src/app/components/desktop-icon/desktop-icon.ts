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

  onClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.iconClicked.emit(this.config());
  }

  onDblClick(event: MouseEvent): void {
    event.preventDefault();
    this.opening.set(true);
    this.iconDblClicked.emit(this.config());
    setTimeout(() => this.opening.set(false), 400);
  }
}
