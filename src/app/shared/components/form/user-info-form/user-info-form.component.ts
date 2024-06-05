import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input, OnInit, SimpleChanges } from '@angular/core';
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
  @Input() isEditable = false; // Initial state: disabled
  @Output() editModeChanged = new EventEmitter<boolean>(); // Emit edit state

  userInfoForm: FormGroup;
  isSubmitted = false;
  user: any = {};

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
  ) {
    this.userInfoForm = this._fb.group({
      identification: [{ value: '', disabled: !this.isEditable }, [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      name: [{ value: '', disabled: !this.isEditable }, Validators.required],
      lastname: [{ value: '', disabled: !this.isEditable }, Validators.required],
      birthday: [{ value: '', disabled: !this.isEditable }, [Validators.required, Validators.pattern('^[0-9]{2}/[0-9]{2}/[0-9]{4}$')]],
      email: [{ value: '', disabled: !this.isEditable }, [Validators.required, Validators.email]],
      phoneNumber: [{ value: '', disabled: !this.isEditable }, Validators.required],
      district: [{ value: '', disabled: !this.isEditable }, Validators.required],
      canton: [{ value: '', disabled: !this.isEditable }, Validators.required],
    });
  }

  /**
   * The `ngOnInit` function asynchronously retrieves the current user's information and populates a form
   * with the user's data if a user is found.
   */
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isEditable']) {
      this.updateFormControls();
    }
  }

  toggleEditMode() {
    console.log('Edit mode changed on the form');
    this.isEditable = !this.isEditable;
    this.updateFormControls(); // Call to update form controls
    this.editModeChanged.emit(this.isEditable); // Notify parent
  }

/**
 * The function `updateFormControls` enables or disables form controls based on the value of
 * `isEditable`.
 */
  private updateFormControls() {
    // Enable/disable form controls based on isEditable
    for (const controlName in this.userInfoForm.controls) {
      const control = this.userInfoForm.get(controlName);
      console.log('Control:', controlName, control);
      if (this.isEditable) {
        control?.enable();
      } else {
        control?.disable();
      }
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