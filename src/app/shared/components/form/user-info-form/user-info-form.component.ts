import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { BlockUIModule } from 'primeng/blockui';
import { PanelModule } from 'primeng/panel';
// Components
import { CustomInputComponent } from '../inputs/custom-input/custom-input.component';
import { MapComponent } from '../../map/map.component';
// Services
import { UserService } from 'src/app/core/services/user/user.service';
// Interfaces
import { User } from 'src/app/core/interfaces/User';
// Utils
import {
  isFieldInvalid,
  isFormatInvalid,
} from 'src/app/shared/utils/inputValidations';

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
    MapComponent,
    BlockUIModule,
    PanelModule,
  ],
})
export class UserInfoFormComponent implements OnInit {
  @Output() userInfo = new EventEmitter<User>();
  @Input() isEditable = false; // Initial state: disabled
  @Output() editModeChanged = new EventEmitter<boolean>(); // Emit edit state
  @Output() cancelClicked = new EventEmitter<void>();

  id: string = '';
  userInfoForm: FormGroup;
  isSubmitted = false;
  user: User | any = {};

  constructor(
    private _fb: FormBuilder,
    private _userService: UserService,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.params['id']
      ? this.route.snapshot.params['id']
      : getAuth().currentUser?.uid;

    this.userInfoForm = this._fb.group(
      {
        identification: [
          '',
          [
            Validators.required,
            Validators.minLength(9),
            Validators.maxLength(9),
          ],
        ],
        name: ['', Validators.required],
        lastname: ['', Validators.required],
        birthdate: [
          '',
          [
            Validators.required,
            Validators.pattern('^[0-9]{2}/[0-9]{2}/[0-9]{4}$'),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', Validators.required],
      },
      {
        disabled: !this.isEditable, // Disable the entire form group if not editable
      }
    );
  }

  /**
   * The `ngOnInit` function asynchronously retrieves user data based on the user ID extracted from the
   * URL and populates a form with the user's information if the user exists.
   */
  async ngOnInit() {
    if (this.id) {
      this._userService
        .getUserById(this.id)
        .then((user) => {
          this.user = user.data;

          this.userInfoForm.patchValue({
            identification: this.user.identification,
            name: this.user.name,
            lastname: this.user.lastname,
            birthdate: this.user.birthdate,
            email: this.user.email,
            phoneNumber: this.user.phoneNumber,
          });
        })
        .catch((error) => {
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

  onAddressChange(newAddress: string) {
    this.user.address = newAddress;
  }

  onLocationChange(newLocation: google.maps.LatLngLiteral | null) {
    this.user.lat = newLocation?.lat;
    this.user.lng = newLocation?.lng;
  }

  /**
   * The function `updateFormControls` updates the form controls based on the user's ownership and
   * editability status.
   */
  private updateFormControls(): void {
    const isOwner = getAuth().currentUser?.uid === this.id;

    for (const controlName in this.userInfoForm.controls) {
      const control = this.userInfoForm.get(controlName);
      if (!isOwner && controlName !== 'phoneNumber') {
        control?.disable();
        continue; // Skip to next control if not the owner and not phoneNumber
      }

      // Enable/disable based on isEditable
      control?.[this.isEditable ? 'enable' : 'disable']();
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
      address,
      lat,
      lng,
    } = this.userInfoForm.value;
    this.userInfo.emit({
      identification,
      name,
      lastname,
      birthdate,
      email,
      phoneNumber,
      address: this.user.address || address,
      lat: this.user.lat || lat,
      lng: this.user.lng || lng,
    });
  }

  onCancel() {
    this.cancelClicked.emit();
  }
}
