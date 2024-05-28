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
import { isFieldInvalid } from 'src/app/shared/utils/inputValidations';

import { isFormatInvalid } from '../../../utils/inputValidations';
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
    return isFieldInvalid(this.loginForm, field);
  }

  isFormatInvalid(field?: any) {
    return isFormatInvalid(this.loginForm, field);
  }

  onSubmit(): void {
    this.loginData.emit(this.loginForm.value);
  }
}
