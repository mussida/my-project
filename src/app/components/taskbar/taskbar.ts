import { Component, signal, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-taskbar',
  templateUrl: './taskbar.html',
  styleUrl: './taskbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Taskbar implements OnInit, OnDestroy {
  protected readonly currentTime = signal('--:--');
  protected readonly currentDate = signal('--/--/----');

  private clockInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.updateClock();
    this.clockInterval = setInterval(() => this.updateClock(), 30_000);
  }

  ngOnDestroy(): void {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
  }

  private updateClock(): void {
    const now = new Date();
    this.currentTime.set(
      now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
    );
    this.currentDate.set(
      now.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
    );
  }
}
