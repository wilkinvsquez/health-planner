import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
import { SpinnerComponent } from '../../spinner/spinner.component';

@Component({
  selector: 'app-user-summary',
  templateUrl: './user-summary.component.html',
  styleUrls: ['./user-summary.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, MapComponent, FormsModule, BlockUIModule, PanelModule, DropdownModule, CommonModule, SpinnerComponent],
})
export class UserSummaryComponent implements OnInit {
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() user: EventEmitter<AppointmentUserData> = new EventEmitter<AppointmentUserData>();
  isLoading: boolean = false;
  currentUser: User | null = null;
  users: User[] = [];
  userInfoForm: FormGroup;
  newUserForm: FormGroup;
  userLocation: google.maps.LatLngLiteral | null = null;
  isEditing = false;
  isAdding: boolean = false;
  isAdmin: boolean = false

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
    this.isLoading = true;
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
    this.isLoading = false;
  }

  ngOnInit() {
    this.authService.isAdmin().subscribe(isAdmin => {
      this.isAdmin = isAdmin
    });
  }

  initializeForm() {
    this.isLoading = true;
    this.userInfoForm = this.fb.group({
      identification: [{ value: !this.isAdmin ? this.currentUser?.identification : '', disabled: true, }, [Validators.required, Validators.minLength(9)],],
      name: [{ value: !this.isAdmin ? this.currentUser?.name + ' ' + this.currentUser?.lastname : '', disabled: true, }, [Validators.required],],
      email: [{ value: !this.isAdmin ? this.currentUser?.email : '', disabled: true }, [Validators.required, Validators.email],],
      phoneNumber: [{ value: !this.isAdmin ? this.currentUser?.phoneNumber : '', disabled: true, }, [Validators.required],],
    });
    this.isLoading = false;
  }

  getCurrentUser() {
    this.isLoading = true;
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
        this.isAdmin = this.currentUser.role === 'admin';

        this.initializeForm();

        if (this.isAdmin) {
          this.getUsers();
        }
      }
      this.isLoading = false;
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
    this.isLoading = true;
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
    this.isLoading = false;
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
          uid: this.currentUser?.uid,
          name: this.currentUser?.name,
          lastname: this.currentUser?.lastname,
          address: this.currentUser?.address,
          lat: this.currentUser?.lat,
          lng: this.currentUser?.lng,
        };
      }
    }
    this.user.emit(this.tempUser);
    this.next.emit();
  }


}
