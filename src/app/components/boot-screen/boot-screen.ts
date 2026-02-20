import { Component, output, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-boot-screen',
  templateUrl: './boot-screen.html',
  styleUrl: './boot-screen.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BootScreen implements OnInit {
  protected readonly visible = signal(true);

  readonly finished = output<void>();

  ngOnInit(): void {
    setTimeout(() => {
      this.visible.set(false);
      setTimeout(() => this.finished.emit(), 600);
    }, 1800);
  }
}
