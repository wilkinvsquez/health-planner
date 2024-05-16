import { Routes } from '@angular/router';

//const redirectUnauthorizedToLogin = () =>
//  redirectUnauthorizedTo(['/auth/login']);

export const ROUTES: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  //  {
  //    path: 'dashboard',
  //    canActivate: [AuthGuard],
  //    data: { authGuardPipe: redirectUnauthorizedToLogin },
  //    loadComponent: () =>
  //      import('./dashboard/dashboard.component').then(
  //        (m) => m.DashboardComponent
  //      ),
  //  },
  {
    path: '**',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];
