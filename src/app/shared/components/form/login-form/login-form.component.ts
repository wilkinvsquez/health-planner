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

  constructor(private _fb: FormBuilder) {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {}

  isFieldInvalid(field?: any) {
    if (field === 'email') {
      return (
        this.loginForm.get(field)?.invalid &&
        this.loginForm.get(field)?.pristine === false &&
        this.loginForm.get(field)?.errors!['required']
      );
    }
  }

  isFormatInvalid(field?: any) {
    if (field === 'email') {
      return (
        this.loginForm.get(field)?.errors &&
        this.loginForm.get(field)?.errors!['email']
      );
    } else if (field === 'password') {
      return (
        this.loginForm.get(field)?.errors &&
        this.loginForm.get(field)?.errors!['required'] &&
        this.loginForm.get(field)?.pristine === false
      );
    }
  }

  onSubmit(): void {
    this.loginData.emit(this.loginForm.value);
  }
}
