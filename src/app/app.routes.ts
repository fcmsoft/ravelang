import { Routes } from '@angular/router';
import { Home } from './features/home/home';

export const routes: Routes = [
  { path: '', component: Home, title: 'Raverlang Home Page' }, // Empty path
  {
    path: 'patterns',
    loadChildren: () => import('./features/patterns/patterns.routes'),
    title: 'Patterns',
  },
  {
    path: 'yarns',
    loadChildren: () => import('./features/yarns/yarns.routes'),
    title: 'Yarns',
  },
  {
    path: 'designers',
    loadChildren: () => import('./features/designers/designers.routes'),
    title: 'Designers',
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }, // Wildcard route for 404 handling
];
