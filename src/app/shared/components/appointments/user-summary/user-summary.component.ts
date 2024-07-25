import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MapComponent } from '../../map/map.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { BlockUIModule } from 'primeng/blockui';
import { PanelModule } from 'primeng/panel';
import { User } from 'src/app/core/interfaces/User';
import { AppointmentUserData } from 'src/app/core/interfaces/AppointmentUserData';
import { DropdownModule } from 'primeng/dropdown';
import { UserService } from 'src/app/core/services/user/user.service';
import { CommonModule, NgClass } from '@angular/common';
import { MapDataService } from 'src/app/shared/services/map-data.service';

@Component({
  selector: 'app-user-summary',
  templateUrl: './user-summary.component.html',
  styleUrls: ['./user-summary.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, MapComponent, FormsModule, BlockUIModule, PanelModule, DropdownModule, NgClass, CommonModule,],
})
export class UserSummaryComponent implements OnInit {
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() user: EventEmitter<AppointmentUserData> = new EventEmitter<AppointmentUserData>();
  currentUser: User | null = null;
  users: User[] = [];
  userInfoForm: FormGroup;
  newUserForm: FormGroup;
  userLocation: google.maps.LatLngLiteral | null = null;
  isEditing = false;
  isAdding = false;
  isAdmin = false;
  tempUser: any = {
    identification: '',
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    lat: 0,
    lng: 0,
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private mapService: MapDataService
  ) {
    setTimeout(() => {
      this.getCurrentUser();
    }, 1000);

    this.newUserForm = this.fb.group({
      identification: ['', [Validators.required, Validators.minLength(9)]],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
    });
    this.userInfoForm = this.fb.group({
      identification: ['', [Validators.required, Validators.minLength(9)]],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
    });
  }

  ngOnInit() { }

  initializeForm() {
    this.userInfoForm = this.fb.group({
      identification: [{ value: !this.isAdmin ? this.currentUser?.identification : '', disabled: true, }, [Validators.required, Validators.minLength(9)],],
      name: [{ value: !this.isAdmin ? this.currentUser?.name + ' ' + this.currentUser?.lastname : '', disabled: true, }, [Validators.required],],
      email: [{ value: !this.isAdmin ? this.currentUser?.email : '', disabled: true }, [Validators.required, Validators.email],],
      phoneNumber: [{ value: !this.isAdmin ? this.currentUser?.phoneNumber : '', disabled: true, }, [Validators.required],],
    });
  }

  getCurrentUser() {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
        this.isAdmin = this.currentUser.role === 'admin';

        this.initializeForm();

        if (this.isAdmin) {
          this.getUsers();
        }
      }
    });
  }

  onUserSelected(user: any) {
    this.tempUser = user.value;
    if (this.tempUser.lat && this.tempUser.lng) {
      this.userLocation = {
        lat: this.tempUser.lat,
        lng: this.tempUser.lng,
      };
      this.mapService.updateUserLocation(this.userLocation);
    }
  }

  getUsers() {
    this.userService.getPatients().then(({ data }) => {
      this.users = data;
    });
  }

  toggleUserForm() {
    if (this.isAdmin) {
      this.isAdding = !this.isAdding;
    } else {
      this.isEditing = !this.isEditing;
      if (this.isEditing) {
        this.enableEdit();
      } else {
        this.disableEdit();
      }
    }
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
    if (this.tempUser.identification === '') {
      if (this.newUserForm.value['identification'] !== '') {
        this.tempUser = {
          ...this.newUserForm.value,
          address: this.currentUser?.address,
          lat: this.currentUser?.lat,
          lng: this.currentUser?.lng,
        };
      } else if (this.userInfoForm.value['identification'] !== '') {
        this.tempUser = {
          ...this.userInfoForm.value,
          address: this.currentUser?.address,
          lat: this.currentUser?.lat,
          lng: this.currentUser?.lng,
        };
      }
    }
    console.log(this.tempUser, 'next step tempUser');

    this.user.emit(this.tempUser);
    this.next.emit();
  }
}
