import { Routes } from '@angular/router';
import { ArchivePage } from './pages/archive-page/archive-page';
import { HomePage } from './pages/home-page/home-page';

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
