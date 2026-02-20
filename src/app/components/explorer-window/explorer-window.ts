import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { ExplorerSidebar } from '../explorer-sidebar/explorer-sidebar';
import { ExplorerBreadcrumb } from '../explorer-breadcrumb/explorer-breadcrumb';
import { BreadcrumbItem, Album } from '../../models/desktop-icon.model';

@Component({
  selector: 'app-explorer-window',
  imports: [ExplorerSidebar, ExplorerBreadcrumb],
  templateUrl: './explorer-window.html',
  styleUrl: './explorer-window.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExplorerWindow {
  readonly title = input('Archive');
  readonly breadcrumbs = input<BreadcrumbItem[]>([]);
  readonly albums = input<Album[]>([]);
  readonly showSidebar = input(true);

  readonly breadcrumbClicked = output<BreadcrumbItem>();
  readonly sidebarAlbumClicked = output<Album>();
  readonly backClicked = output<void>();
}
