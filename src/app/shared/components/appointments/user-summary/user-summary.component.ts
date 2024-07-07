import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MapComponent } from '../../map/map.component';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { BlockUIModule } from 'primeng/blockui';
import { PanelModule } from 'primeng/panel';
import { User } from 'src/app/core/interfaces/User';

@Component({
  selector: 'app-user-summary',
  templateUrl: './user-summary.component.html',
  styleUrls: ['./user-summary.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MapComponent,
    FormsModule,
    BlockUIModule,
    PanelModule,
  ],
})
export class UserSummaryComponent implements OnInit {
  // @Input() user: any;
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() user: EventEmitter<any> = new EventEmitter<User>();
  currentUser: User | null = null;
  tempUser: any = {
    identification: '',
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    lat: 0,
    lng: 0,
  };
  userInfoForm: any;
  isEditing = false;

  constructor(private _fb: FormBuilder, private authService: AuthService) {
    this.getCurrentUser();
    this.userInfoForm = this._fb.group({
      identification: [
        {
          value: this.currentUser?.identification || '',
          disabled: !this.isEditing,
        },
        Validators.required,
      ],
      name: [
        {
          value:
            this.currentUser?.name + ' ' + this.currentUser?.lastname || '',
          disabled: !this.isEditing,
        },
        Validators.required,
      ],
      email: [
        { value: this.currentUser?.email || '', disabled: !this.isEditing },
        Validators.required,
      ],
      phoneNumber: [
        {
          value: this.currentUser?.phoneNumber || '',
          disabled: !this.isEditing,
        },
        Validators.required,
      ],
    });
    this.disableEdit();
  }

  ngOnInit() {}

  getCurrentUser() {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
        this.tempUser.address = this.currentUser.address;
        this.tempUser.lat = this.currentUser.lat;
        this.tempUser.lng = this.currentUser.lng;
      } else {
        this.authService.getCurrentUser();
      }
    });
  }

  disableEdit() {
    Object.keys(this.userInfoForm.controls).forEach((controlName) => {
      this.userInfoForm.get(controlName)?.disable();
    });
  }

  enableEdit() {
    this.userInfoForm.enable();
  }

  onAddressChange(newAddress: string) {
    this.tempUser.address = newAddress;
  }

  onLocationChange(newLocation: google.maps.LatLngLiteral | null) {
    this.tempUser.lat = newLocation?.lat;
    this.tempUser.lng = newLocation?.lng;
  }

  nextStep() {
    this.tempUser = {
      ...this.userInfoForm.value,
      address: this.currentUser?.address,
      lat: this.currentUser?.lat,
      lng: this.currentUser?.lng,
    };
    this.user.emit(this.tempUser);
    this.next.emit();
  }

  editOrCancelUser() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.enableEdit();
    } else {
      this.disableEdit();
    }
  }
}
