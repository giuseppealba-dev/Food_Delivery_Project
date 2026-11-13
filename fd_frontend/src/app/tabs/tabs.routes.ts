import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { utenteGuard } from '../guards/utente.guard';
import { fattorinoGuard } from '../guards/fattorino.guard';
import { adminGuard } from '../guards/admin.guard';

export const routes: Routes = [
  {
    path: 'user',
    component: TabsPage,
    children: [
      {
        path: 'homepage',
        loadComponent: () =>
          import('../tab1/tab1.page').then((m) => m.Tab1Page),
        canActivate: [utenteGuard],
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('../tab2/tab2.page').then((m) => m.Tab2Page),
        canActivate: [utenteGuard],
      },
      {
        path: 'map',
        loadComponent: () =>
          import('../tab-map/tab-map.page').then((m) => m.TabMapPage),
        canActivate: [fattorinoGuard]
      },
      {
        path: 'ordini_fattorino',
        loadComponent: () =>
          import('../tab-ordini-fattorino/tab-ordini-fattorino.page').then((m) => m.TabOrdiniFattorinoPage),
        canActivate: [fattorinoGuard]
      },
      {
        path: 'ordini_admin',
        loadComponent: () =>
          import('../tab-ordini-admin/tab-ordini-admin.page').then((m) => m.TabOrdiniAdminPage),
        canActivate: [adminGuard]
      },
      {
        path: 'gestione_locale',
        loadChildren: () => import('../tab-gestione/tab-gestione.routes').then((m) => m.routes),
        canActivate: [adminGuard]
      },
      {
        path: 'profile',
        loadChildren: () => import('../tab3/tab3.routes').then((m) => m.routes),
      },

      {
        path: '',
        redirectTo: '/user/homepage',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/user/homepage',
    pathMatch: 'full',
  },
];
