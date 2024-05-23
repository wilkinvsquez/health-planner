import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { User } from 'src/app/core/interfaces/User';

import { CustomInputComponent } from '../inputs/custom-input/custom-input.component';
import { PasswordInputComponent } from '../inputs/password-input/password-input.component';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['../styles/form-styles.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    PasswordInputComponent,
    CustomInputComponent,
  ],
})
export class RegistrationFormComponent {
  @Output() registrationData = new EventEmitter<User>();

  registrationForm: FormGroup;
  isSubmitted = false;

  constructor(private _fb: FormBuilder) {
    this.registrationForm = this._fb.group({
      name: ['Wilkin', Validators.required],
      lastname: ['Vasquez', Validators.required],
      email: [
        'wilkinvsquez@gmail.com',
        [Validators.required, Validators.email],
      ],
      password: ['123123', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['123123', Validators.required],
    });
  }

  isFieldInvalid(field?: any) {
    return this.registrationForm.get(field)?.invalid;
  }

  isFormatInvalid(field?: any) {
    if (field === 'email') {
      return (
        this.registrationForm.get(field)?.errors &&
        this.registrationForm.get(field)?.errors!['email']
      );
    } else if (field === 'password') {
      return (
        this.registrationForm.get(field)?.errors &&
        this.registrationForm.get(field)?.errors!['minlength']
      );
    }
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
      userRelations: [],
      role: 'user',
      active: true,
    });
  }
}
