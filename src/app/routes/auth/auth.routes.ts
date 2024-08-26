import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { RegistrationComponent } from './registration/registration.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  { path: 'register', component: RegistrationComponent },
  { path: 'password-reset', component: PasswordResetComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: 'home', redirectTo: 'home', pathMatch: 'full' },
];
