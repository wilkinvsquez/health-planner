import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PasswordInputComponent } from '../inputs/password-input/password-input.component';
import { CustomInputComponent } from '../inputs/custom-input/custom-input.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserAuth } from 'src/app/core/interfaces/UserAuth';

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

  onSubmit(): void {
    this.loginData.emit(this.loginForm.value);
  }
}
