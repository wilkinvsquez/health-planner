import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { User } from 'src/app/core/interfaces/User';
import {
  isFieldInvalid,
  isFormatInvalid,
} from 'src/app/shared/utils/inputValidations';
import { AuthService } from 'src/app/core/services/auth/auth.service';

import { CustomInputComponent } from '../inputs/custom-input/custom-input.component';
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
export class UserInfoFormComponent implements OnInit {
  @Output() userInfo = new EventEmitter<User>();
  userInfoForm: FormGroup;
  isSubmitted = false;
  user: any = {};

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
  ) {
    this.userInfoForm = this._fb.group({
      identification: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      birthday: ['', [Validators.required, Validators.pattern('^[0-9]{2}/[0-9]{2}/[0-9]{4}$')]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      district: ['', Validators.required],
      canton: ['', Validators.required],
    });
  }

  async ngOnInit() {
    const currentUser = await this._authService.getCurrentUser();

    if (currentUser) {
      this.user = currentUser;
      this.userInfoForm.patchValue({
        identification: this.user.identification,
        name: this.user.name,
        lastname: this.user.lastname,
        birthday: this.user.birthday,
        email: this.user.email,
        phoneNumber: this.user.phoneNumber,
        district: this.user.district,
        canton: this.user.canton,
      });
    } else {
      console.log('No user found');
    }
  }

  isFieldInvalid(field?: any) {
    return isFieldInvalid(this.userInfoForm, field);
  }

  isFormatInvalid(field?: any) {
    return isFormatInvalid(this.userInfoForm, field);
  }

  onSubmit() {
    this.isSubmitted = true;
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