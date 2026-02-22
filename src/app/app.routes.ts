import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authGuard] },
  { path: 'tasks', loadComponent: () => import('./features/tasks/task-list/task-list.component').then(m => m.TaskListComponent), canActivate: [authGuard] },
  { path: '**', redirectTo: 'dashboard' },
];
