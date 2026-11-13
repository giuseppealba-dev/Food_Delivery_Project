import { Routes } from '@angular/router';
import { Tab3Page } from './tab3.page';
import { authGuard } from '../guards/auth.guard';
import { profileRedirectGuard } from '../guards/profile-redirect.guard';
import { noAuthGuard } from '../guards/no-auth.guard';
import { utenteGuard } from '../guards/utente.guard';

export const routes: Routes = [
  {
    path: '',
    component: Tab3Page,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('../auth/login/login.component').then((m) => m.LoginComponent),
        canActivate: [noAuthGuard],
      },
      {
        path: 'register',
        loadComponent: () =>
          import('../auth/register/register.component').then((m) => m.RegisterComponent),
        canActivate: [noAuthGuard],
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../auth/profile-dashboard/profile-dashboard.component').then((m) => m.ProfileDashboardComponent),
        canActivate: [authGuard],
      },
      {
        path: 'editPassword',
        loadComponent: () =>
          import('../auth/edit-password/edit-password.component').then((m) => m.EditPasswordComponent),
        canActivate: [authGuard],
      },
      {
        path: 'listIndirizzi',
        loadComponent: () =>
          import('../auth/list-indirizzo/list-indirizzo.component').then((m) => m.ListIndirizzoComponent),
        canActivate: [authGuard, utenteGuard],
      },
      {
        path: 'addIndirizzo',
        loadComponent: () =>
          import('../auth/add-indirizzo/add-indirizzo.component').then((m) => m.AddIndirizzoComponent),
        canActivate: [authGuard, utenteGuard],
      },
      {
        path: 'storicoOrdini',
        loadComponent: () =>
          import('../auth/storico-ordini/storico-ordini.component').then((m) => m.StoricoOrdiniComponent),
        canActivate: [authGuard, utenteGuard],
      },
      {
        path: '',
        canActivate: [profileRedirectGuard],
        children: []
      },
    ],
  },
];