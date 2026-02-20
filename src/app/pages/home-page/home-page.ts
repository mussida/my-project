import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ContextMenu } from '../../components/context-menu/context-menu';
import { Taskbar } from '../../components/taskbar/taskbar';
import { Desktop } from '../../components/desktop/desktop';
import { BootScreen } from '../../components/boot-screen/boot-screen';
import { DesktopIconConfig } from '../../models/desktop-icon.model';


@Component({
  selector: 'app-home-page',
  imports: [BootScreen, Desktop, Taskbar, ContextMenu],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  protected readonly booting = signal(true);

  protected readonly desktopIcons: DesktopIconConfig[] = [
    {
      id: 'archive',
      label: 'Archive',
      tooltip: 'Archive — Photo Albums',
      route: '/archive',
      iconType: 'archive',
    },
    {
      id: 'blog',
      label: 'Blog',
      tooltip: 'Blog — Personal Writings',
      route: '/blog',
      iconType: 'blog',
    },
    {
      id: 'about',
      label: 'About Me',
      tooltip: 'About Me',
      route: '/about',
      iconType: 'about',
    },
    {
      id: 'bin',
      label: 'Cestino',
      tooltip: 'Cestino',
      route: '#',
      iconType: 'bin',
      position: 'bottom-right',
    },
  ];

  constructor(private router: Router) {}

  onBootFinished(): void {
    this.booting.set(false);
  }

  onIconOpened(icon: DesktopIconConfig): void {
    if (icon.route && icon.route !== '#') {
      this.router.navigate([icon.route]);
    }
  }
}