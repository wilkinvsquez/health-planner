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
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
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
    private _homeComponent: HomeComponent,
    private _modalComponent: ModalComponent
  ) {
    this.userInfoForm = this._fb.group({
      identification: [
        this._homeComponent.user.identification || '',
        [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9)
      ]],
      name: ['', Validators.required],
      lastname: [
        this._homeComponent.user.lastname || '',
        Validators.required
      ],
      birthday: 
      [
        this._homeComponent.user.birthday || '',
      [
        Validators.required,
        Validators.pattern('^[0-9]{2}/[0-9]{2}/[0-9]{4}$')
      ]],
      email: [
        this._homeComponent.user.email || '',
        [
          Validators.required,
          Validators.email
        ]],
      phoneNumber: [
        this._homeComponent.user.phoneNumber || '',
        Validators.required
      ],
      district: [
        this._homeComponent.user.district || '',
        Validators.required
      ],
      canton: [
        this._homeComponent.user.canton || '',
        Validators.required
      ],
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
    this._modalComponent.closeModal();
    const { identification, name, lastname, birthday, email, phoneNumber, district, canton } = 
    this.userInfoForm.value;
    this.userInfo.emit({
      identification,
      name,
      lastname,
      birthday,
      email,
      phoneNumber,
      district,
      canton
    });
  }
}
