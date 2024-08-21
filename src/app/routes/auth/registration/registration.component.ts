import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { User } from 'src/app/core/interfaces/User';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ToastService } from 'src/app/shared/services/toast.service';

import { RegistrationFormComponent } from '../../../shared/components/form/registration-form/registration-form.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['../styles/auth-styles.component.scss'],
  standalone: true,
  imports: [RegistrationFormComponent, RouterLink],
})
export class RegistrationComponent {
  constructor(
    private _authService: AuthService,
    private _toastService: ToastService,
    private _router: Router
  ) { }

  onRegister(user: User) {
    this._authService.register(user).then((response: any) => {
      if (response.error) {
        if (response.error.code === 'auth/email-already-in-use') {
          this._toastService.showWarning(
            'Este correo ya se encuentra registrado'
          );
          this._router.navigate(['/auth/login']);
        }
        else {
          this._toastService.showError(
            'Ha ocurrido un error al intentar registrarte. Por favor, intenta de nuevo.'
          );
        }
      } else {
        this._toastService.showSuccess(
          'El correo de verificación ha sido enviado. Por favor, verifica tu correo para continuar.'
        );
        this._router.navigate(['/auth/login']);
      }
    });
  }
}
