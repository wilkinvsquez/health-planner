import { Routes } from '@angular/router';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () =>
 redirectUnauthorizedTo(['/auth/login']);

export const ROUTES: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
   {
     path: 'home',
     canActivate: [AuthGuard],
     data: { authGuardPipe: redirectUnauthorizedToLogin },
     loadComponent: () =>
       import('./home/home.component').then(
         (m) => m.HomeComponent
       ),
   },
  {
    path: '**',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];
