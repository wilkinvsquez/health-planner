import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { UserAuth } from 'src/app/core/interfaces/UserAuth';

import { CustomInputComponent } from '../inputs/custom-input/custom-input.component';
import { PasswordInputComponent } from '../inputs/password-input/password-input.component';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['../styles/form-styles.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    PasswordInputComponent,
    CustomInputComponent,
    ReactiveFormsModule,
  ],
})
export class LoginFormComponent implements OnInit {
  @Output() loginData = new EventEmitter<UserAuth>();
  loginForm: FormGroup;
  passwordFieldType: string = 'password';
  formErrors: any[] = [];

  constructor(private _fb: FormBuilder) {
    this.loginForm = this._fb.group({
      email: [
        'wilkinvsquez@gmail.com',
        [Validators.required, Validators.email],
      ],
      password: ['123123', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {}

  togglePasswordVisibility(): void {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  handleErrors(errors: Error[]): void {
    if (errors.length === 0) {
      this.formErrors = [];
      return;
    }
    if (this.formErrors.includes(errors[0])) return;
    this.formErrors.push(...errors);
  }

  onSubmit(): void {
    this.loginData.emit(this.loginForm.value);
  }
}
