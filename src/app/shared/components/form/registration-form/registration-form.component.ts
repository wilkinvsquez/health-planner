import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, } from '@angular/forms';
import { Router, RouterLink, } from '@angular/router';
import { User } from 'src/app/core/interfaces/User';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { isFieldInvalid, isFormatInvalid, } from 'src/app/shared/utils/inputValidations';

import { CustomInputComponent, } from '../inputs/custom-input/custom-input.component';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['../styles/form-styles.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    CustomInputComponent,
  ],
})
export class RegistrationFormComponent {
  @Output() registrationData = new EventEmitter<User>();

  registrationForm: FormGroup;
  isSubmitted = false;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _toastService: ToastService,
    private _authService: AuthService
  ) {
    this.registrationForm = this._fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  isFieldInvalid(field?: any) {
    return isFieldInvalid(this.registrationForm, field);
  }

  isFormatInvalid(field?: any) {
    return isFormatInvalid(this.registrationForm, field);
  }

  passwordsMatch() {
    return (
      this.registrationForm.get('password')?.value !==
      this.registrationForm.get('confirmPassword')?.value
    );
  }

  onSubmit() {
    this.isSubmitted = true;
    const { name, lastname, email, password } = this.registrationForm.value;
    this.registrationData.emit({
      name,
      lastname,
      email,
      password,
    });
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
