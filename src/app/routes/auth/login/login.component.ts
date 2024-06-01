import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ToastService } from 'src/app/shared/services/toast.service';

import { UserAuth } from 'src/app/core/interfaces/UserAuth';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { LoginFormComponent } from 'src/app/shared/components/form/login-form/login-form.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../styles/auth-styles.component.scss'],
  standalone: true,
  imports: [RouterLink, LoginFormComponent],
})
export class LoginComponent implements OnInit {
  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _toastService: ToastService
  ) { }

  ngOnInit() { }

  onLogin(user: UserAuth) {
    this._authService.signIn(user).then((response: any) => {
      if (response.error) {
        console.log(response.error.code);
        this._toastService.showError('Correo o contraseña incorrectos');
      } else {
        console.log(response.message);
        this._toastService.showSuccess('Inicio de sesión exitoso');
        this._router.navigate(['/home']);
      }
    });
  }
}
