import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { ArchivePage } from './pages/archive-page/archive-page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'archive',
    component: ArchivePage,
  },
];
