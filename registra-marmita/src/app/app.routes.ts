import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'clientes',
    loadComponent: () =>
      import('./components/clientes/clientes.component').then((m) => m.ClientesComponent),
    canActivate: [authGuard],
  },
  {
    path: 'retiradas',
    loadComponent: () =>
      import('./components/retiradas/retiradas.component').then((m) => m.RetiradasComponent),
    canActivate: [authGuard],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
