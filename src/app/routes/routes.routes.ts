import { AuthGuard, canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Routes } from '@angular/router';
import { adminGuard } from '../core/guards/admin.guard';

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
    canActivate: [AuthGuard, adminGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    loadComponent: () =>
      import('./agenda/agenda/agenda.component').then((m) => m.AgendaComponent),
  },
  {
    path: 'agenda/new-event',
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    loadComponent: () =>
      import('./agenda/new-event/new-event.component').then((m) => m.NewEventComponent),
  },
  {
    path: 'agenda/new-event/:date',
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    loadComponent: () =>
      import('./agenda/new-event/new-event.component').then((m) => m.NewEventComponent),
  },

  {
    path: 'users',
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    loadComponent: () =>
      import('./users/users/users.component').then((m) => m.UsersComponent),
  },
  {
    path: 'users/:id',
    canActivate: [AuthGuard, adminGuard],
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
    path: 'not-found',
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    loadComponent: () =>
      import('../shared/components/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
  {
    path: 'profile/user/:id',
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    loadComponent: () =>
      import('./user-profile/user-profile.component').then((m) => m.UserProfileComponent),
  },
  {
    path: 'edit-user/:id',
    canActivate: [AuthGuard, adminGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    loadComponent: () =>
      import('./edit-user/edit-user.component').then((m) => m.EditUserComponent),
  },
  {
    path: 'user/settings/:id',
    canActivate: [AuthGuard, adminGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    loadComponent: () =>
      import('./users/user-settings/user-settings.component').then((m) => m.UserSettingsComponent),
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
