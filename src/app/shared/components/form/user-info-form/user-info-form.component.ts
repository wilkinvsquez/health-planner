import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { BlockUIModule } from 'primeng/blockui';
// Components
import { CustomInputComponent, } from '../inputs/custom-input/custom-input.component';
import { MapComponent } from '../../map/map.component';
// Services
import { UserService } from 'src/app/core/services/user/user.service';
// Interfaces
import { User } from 'src/app/core/interfaces/User';
// Utils
import { MapDataService } from 'src/app/shared/services/map-data.service';
import { isFieldInvalid, isFormatInvalid, } from 'src/app/shared/utils/inputValidations';


@Component({
  selector: 'app-user-info-form',
  templateUrl: './user-info-form.component.html',
  styleUrls: [
    '../styles/form-styles.component.scss',
    './user-info-form.component.scss',
  ],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CustomInputComponent, MapComponent, BlockUIModule],
})
export class UserInfoFormComponent implements OnInit {
  @Output() userInfo = new EventEmitter<User>();
  @Input() isEditable = false; // Initial state: disabled
  @Output() editModeChanged = new EventEmitter<boolean>(); // Emit edit state

  id: string = '';
  userInfoForm: FormGroup;
  isSubmitted = false;
  user: User | any = {};
  formattedAddress: string = '';

  constructor(
    private _fb: FormBuilder,
    private _userService: UserService,
    private route: ActivatedRoute,
    private mapDataService: MapDataService
  ) {
    this.id = this.route.snapshot.params['id'] ? this.route.snapshot.params['id'] : getAuth().currentUser?.uid;

    this.userInfoForm = this._fb.group({
      identification: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      birthdate: ['', [Validators.required, Validators.pattern('^[0-9]{2}/[0-9]{2}/[0-9]{4}$')]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      district: ['', Validators.required],
      canton: ['', Validators.required]
    }, {
      disabled: !this.isEditable // Disable the entire form group if not editable
    });
  }

  /**
   * The `ngOnInit` function asynchronously retrieves user data based on the user ID extracted from the
   * URL and populates a form with the user's information if the user exists.
   */
  async ngOnInit() {
    if (this.id) {
      this._userService.getUserById(this.id).then((user) => {
        this.user = user.data;

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
    this.getAddress();
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
    this.formattedAddress = newAddress;
  }

  getAddress() {
    this.mapDataService.formattedAddress$.subscribe(address => {
      this.formattedAddress = address;
    });
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
