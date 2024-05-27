import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { User } from 'src/app/core/interfaces/User';

import { CustomInputComponent } from '../inputs/custom-input/custom-input.component';
import { HomeComponent } from 'src/app/routes/home/home.component';


@Component({
  selector: 'app-user-info-form',
  templateUrl: './user-info-form.component.html',
  styleUrls: [
    '../styles/form-styles.component.scss',
    './user-info-form.component.scss',
  ],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CustomInputComponent,
  ],
})
export class UserInfoFormComponent {
  @Output() userInfo = new EventEmitter<User>();

  userInfoForm: FormGroup;
  isSubmitted = false;

  constructor(
    private _fb: FormBuilder,
    private _homeComponent: HomeComponent
  ) {
    this.userInfoForm = this._fb.group({
      identification: ['', Validators.required],
      name: ['', Validators.required],
      lastname: [this._homeComponent.user.lastname, Validators.required],
      birthday: ['', Validators.required],
      email: [this._homeComponent.user.email, [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      district: ['', Validators.required],
      canton: ['', Validators.required],
    });
  }

  isFieldInvalid(field?: any) {
    if (field === 'email') {
      return (
        this.userInfoForm.get(field)?.invalid &&
        this.userInfoForm.get(field)?.pristine === false &&
        this.userInfoForm.get(field)?.errors!['required']
      );
    }
    return (
      this.userInfoForm.get(field)?.invalid &&
      this.userInfoForm.get(field)?.pristine === false
    );
  }

  isFormatInvalid(field?: any) {
    if (field === 'email') {
      return (
        this.userInfoForm.get(field)?.errors &&
        this.userInfoForm.get(field)?.errors!['email']
      );
    } else if (field === 'password') {
      return (
        this.userInfoForm.get(field)?.errors &&
        this.userInfoForm.get(field)?.errors!['minlength']
      );
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    const { name, lastname, email, password } = this.userInfoForm.value;
    this.userInfo.emit({
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
