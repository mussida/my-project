import { Component, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { Album } from '../../models/desktop-icon.model';

@Component({
  selector: 'app-explorer-sidebar',
  templateUrl: './explorer-sidebar.html',
  styleUrl: './explorer-sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExplorerSidebar {
  readonly albums = input<Album[]>([]);

  readonly albumClicked = output<Album>();

  protected readonly selectedAlbumId = signal<string | null>(null);

  onAlbumClick(album: Album): void {
    this.selectedAlbumId.set(album.id);
    this.albumClicked.emit(album);
  }
}
