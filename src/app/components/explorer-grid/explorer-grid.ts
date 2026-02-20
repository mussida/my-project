import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { Album, Photo } from '../../models/desktop-icon.model';

@Component({
  selector: 'app-explorer-grid',
  templateUrl: './explorer-grid.html',
  styleUrl: './explorer-grid.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExplorerGrid {
  readonly albums = input<Album[]>([]);
  readonly photos = input<Photo[]>([]);
  readonly viewMode = input<'albums' | 'photos'>('albums');

  readonly albumOpened = output<Album>();
  readonly photoOpened = output<Photo>();

  onAlbumDblClick(album: Album): void {
    this.albumOpened.emit(album);
  }

  onPhotoDblClick(photo: Photo): void {
    this.photoOpened.emit(photo);
  }
}
