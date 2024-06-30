import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/services/toast.service';

import { AuthService } from 'src/app/core/services/auth/auth.service';
import { CustomInputComponent } from 'src/app/shared/components/form/inputs/custom-input/custom-input.component';
import { UserService } from 'src/app/core/services/user/user.service';
import { Response } from 'src/app/core/interfaces/Response';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
  standalone: true,
  imports: [CustomInputComponent, ReactiveFormsModule, CommonModule],
})
export class PasswordResetComponent implements OnInit {
  passwordResetForm: FormGroup;
  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService,
    private userService: UserService
  ) {
    this.passwordResetForm = this._fb.group({
      email: [
        'wilkinvsquez@gmail.com',
        [Validators.required, Validators.email],
      ],
    });
  }

  ngOnInit() { }

  async onSubmit() {
    const response: Response = await this.userService.searchUsers(this.passwordResetForm.value.email);
    if (!response.success || !response.data || response.data.length === 0) {
      this.toastService.showError(
        'No se encontró un usuario con el correo electrónico proporcionado.'
      );
      return;
    }
    const emailSent = await this.authService.sendPasswordResetEmail(this.passwordResetForm.value.email);
    if (emailSent.success) {
      this.toastService.showSuccess(
        'Correo de recuperación enviado. Por favor, revisa tu bandeja de entrada.'
      );
      this.router.navigate(['/auth/login']);
    } else {
      this.toastService.showError(
        'Error al enviar correo de recuperación. Por favor, inténtalo de nuevo.'
      );
    }
  }
}
