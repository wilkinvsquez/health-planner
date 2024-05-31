import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { UserAuth } from 'src/app/core/interfaces/UserAuth';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { isFieldInvalid } from 'src/app/shared/utils/inputValidations';

import { isFormatInvalid } from '../../../utils/inputValidations';
import { CustomInputComponent } from '../inputs/custom-input/custom-input.component';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['../styles/form-styles.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    CustomInputComponent,
    ReactiveFormsModule,
  ],
})
export class LoginFormComponent implements OnInit {
  @Output() loginData = new EventEmitter<UserAuth>();
  loginForm: FormGroup;
  passwordFieldType: string = 'password';
  formErrors: any[] = [];

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _toastService: ToastService,
    private _router: Router
  ) {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {}

  isFieldInvalid(field?: any) {
    return isFieldInvalid(this.loginForm, field);
  }

  isFormatInvalid(field?: any) {
    return isFormatInvalid(this.loginForm, field);
  }

  onSubmit(): void {
    this.loginData.emit(this.loginForm.value);
  }

  async onSignInWithGoogle() {
    try {
      await this._authService.signInWithGoogleProvider().then(() => {
        this._toastService.showSuccess('Inicio de sesión exitoso');
        this._router.navigate(['/home']);
      });
    } catch (error) {
      this._toastService.showError('Correo o contraseña incorrectos');
    }
  }
}
