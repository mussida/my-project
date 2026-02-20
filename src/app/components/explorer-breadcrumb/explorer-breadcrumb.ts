import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { BreadcrumbItem } from '../../models/desktop-icon.model';

@Component({
  selector: 'app-explorer-breadcrumb',
  templateUrl: './explorer-breadcrumb.html',
  styleUrl: './explorer-breadcrumb.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExplorerBreadcrumb {
  readonly items = input<BreadcrumbItem[]>([]);

  readonly itemClicked = output<BreadcrumbItem>();

  onItemClick(item: BreadcrumbItem): void {
    if (item.route) {
      this.itemClicked.emit(item);
    }
  }
}
