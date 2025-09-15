import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/vessels',
    pathMatch: 'full',
  },
  {
    path: 'vessels',
    loadComponent: () =>
      import('./pages/vessels/vessels.component').then(
        (m) => m.VesselsComponent
      ),
  },
  {
    path: 'emissions',
    loadComponent: () =>
      import('./pages/emissions/emissions.component').then(
        (m) => m.EmissionsComponent
      ),
  },
];
