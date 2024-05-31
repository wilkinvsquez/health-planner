import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Routes } from '@angular/router';

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
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'agenda',
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    loadComponent: () =>
      import('./agenda/agenda.component').then((m) => m.AgendaComponent),
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    loadComponent: () =>
      import('./users/users/users.component').then((m) => m.UsersComponent),
  },
  {
    path: 'user/:id',
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    loadComponent: () =>
      import('./users/user/user.component').then((m) => m.UserComponent),
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    loadComponent: () =>
      import('./profile/profile.component').then((m) => m.ProfileComponent),
  },

  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
