import { Routes } from '@angular/router';
import { Home } from './features/home/home';

export const routes: Routes = [
    { path: '', component: Home, title: 'Raverlang Home Page' }, // Empty path
    {
        path: 'patterns',
        loadChildren: () => import('./features/patterns/patterns.routes'),
        title: 'Patterns'
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }, // Wildcard route for 404 handling
];
