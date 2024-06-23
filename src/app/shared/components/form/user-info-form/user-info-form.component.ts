import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { getAuth } from 'firebase/auth';
// Components
import { CustomInputComponent, } from '../inputs/custom-input/custom-input.component';
import { MapComponent } from '../../map/map.component';
// Services
import { UserService } from 'src/app/core/services/user/user.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
// Interfaces
import { User } from 'src/app/core/interfaces/User';
// Utils
import { isFieldInvalid, isFormatInvalid, } from 'src/app/shared/utils/inputValidations';


@Component({
  selector: 'app-user-info-form',
  templateUrl: './user-info-form.component.html',
  styleUrls: [
    '../styles/form-styles.component.scss',
    './user-info-form.component.scss',
  ],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CustomInputComponent, MapComponent],
})
export class UserInfoFormComponent implements OnInit {
  @Output() userInfo = new EventEmitter<User>();
  @Input() isEditable = false; // Initial state: disabled
  @Output() editModeChanged = new EventEmitter<boolean>(); // Emit edit state

  id: string = '';
  userInfoForm: FormGroup;
  isSubmitted = false;
  user: User | any = {};

  constructor(private _fb: FormBuilder, private _userService: UserService, private route: ActivatedRoute,) {
    this.id = this.route.snapshot.params['id'];

    this.userInfoForm = this._fb.group({
      identification: [
        { value: '', disabled: !this.isEditable },
        [Validators.required, Validators.minLength(9), Validators.maxLength(9)],
      ],
      name: [{ value: '', disabled: !this.isEditable }, Validators.required],
      lastname: [
        { value: '', disabled: !this.isEditable },
        Validators.required,
      ],
      birthdate: [
        { value: '', disabled: !this.isEditable },
        [
          Validators.required,
          Validators.pattern('^[0-9]{2}/[0-9]{2}/[0-9]{4}$'),
        ],
      ],
      email: [
        { value: '', disabled: !this.isEditable },
        [Validators.required, Validators.email],
      ],
      phoneNumber: [
        { value: '', disabled: !this.isEditable },
        Validators.required,
      ],
      district: [
        { value: '', disabled: !this.isEditable },
        Validators.required,
      ],
      canton: [{ value: '', disabled: !this.isEditable }, Validators.required],
    });
  }

  /**
   * The `ngOnInit` function asynchronously retrieves user data based on the user ID extracted from the
   * URL and populates a form with the user's information if the user exists.
   */
  async ngOnInit() {
    if (this.id) {
      this._userService.getUserById(this.id).then((user) => {
        this.user = user;

        this.userInfoForm.patchValue({
          identification: this.user.identification,
          name: this.user.name,
          lastname: this.user.lastname,
          birthdate: this.user.birthdate,
          email: this.user.email,
          phoneNumber: this.user.phoneNumber,
          district: this.user.district,
          canton: this.user.canton,
        });
      }).catch(error => {
        console.error('Error fetching user data:', error);
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

  onEditModeChanged() {
    this.editModeChanged.emit(!this.isEditable);
  }

  /**
   * The function `updateFormControls` enables or disables form controls based on the value of
   * `isEditable`.
   */
  private updateFormControls() {
    const auth = getAuth();
    const authUser = auth.currentUser;
    if (authUser?.uid === this.id) {
      // Enable/disable form controls based on isEditable
      for (const controlName in this.userInfoForm.controls) {
        const control = this.userInfoForm.get(controlName);
        if (this.isEditable) {
          control?.enable();
        } else {
          control?.disable();
        }
      }
    }
    else {
      const control = this.userInfoForm.get('phoneNumber');
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
    const {
      identification,
      name,
      lastname,
      birthdate,
      email,
      phoneNumber,
      district,
      canton,
    } = this.userInfoForm.value;
    this.userInfo.emit({
      identification,
      name,
      lastname,
      birthdate,
      email,
      phoneNumber,
      district,
      canton,
    });
  }
}
