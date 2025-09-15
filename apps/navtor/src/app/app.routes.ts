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
      import('./domains/vessels/pages/vessels/vessels.component').then(
        (m) => m.VesselsComponent
      ),
  },
  {
    path: 'emissions',
    loadComponent: () =>
      import('./domains/emissions/pages/emissions/emissions.component').then(
        (m) => m.EmissionsComponent
      ),
  },
];
