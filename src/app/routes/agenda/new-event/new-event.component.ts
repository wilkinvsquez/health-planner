import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { Appointment } from 'src/app/core/interfaces/Appointment';
import { AppointmentUserData } from 'src/app/core/interfaces/AppointmentUserData';
import { Location } from 'src/app/core/interfaces/Location';
import { User } from 'src/app/core/interfaces/User';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { AddCategoriesComponent } from 'src/app/shared/components/add-categories/add-categories.component';
import { AppointmentSummaryComponent } from 'src/app/shared/components/appointments/appointment-summary/appointment-summary.component';
import { DateAndTimePickerComponent } from 'src/app/shared/components/appointments/date-and-time-picker/date-and-time-picker.component';
import { SelectUserComponent } from 'src/app/shared/components/appointments/select-user/select-user.component';
import { UserSummaryComponent } from 'src/app/shared/components/appointments/user-summary/user-summary.component';
import { MapComponent } from 'src/app/shared/components/map/map.component';
import { AppointmentService } from 'src/app/core/services/appointment/appointment.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.scss'],
  standalone: true,
  imports: [
    MapComponent,
    AddCategoriesComponent,
    DateAndTimePickerComponent,
    SelectUserComponent,
    StepperModule,
    ButtonModule,
    UserSummaryComponent,
    AppointmentSummaryComponent,
    SpinnerComponent
  ],
})
export class NewEventComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  searchTerm: string = '';
  appointment: Appointment = {} as Appointment;
  isLoading: boolean = false;
  constructor(private authService: AuthService, private router: Router,
    private _appointmentService: AppointmentService, private _toastService: ToastService) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
      } else {
        this.authService.getCurrentUser();
      }
    });
  }

  private getUserData(userData: any) {
    return {
      uid: userData.uid,
      name: userData.name,
      lastname: userData.lastname,
      identification: userData.identification,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
    };
  }

  onDateSelected(date: string) {
    this.appointment.datetime = date;
  }

  onScheduleAppointment() {
    const patient: AppointmentUserData = this.getUserData(this.appointment.patient);
    const professional: AppointmentUserData = this.getUserData(this.appointment.professional);
    const location: Location = {
      address: this.appointment.patient.address || '',
      lat: this.appointment.patient.lat || 0,
      lng: this.appointment.patient.lng || 0,
    }
    const { datetime, specialties } = this.appointment;

    const appointmentEvent: Appointment = {
      datetime,
      specialties,
      patient,
      professional,
      location,
    };
    this._appointmentService.createAppointment(appointmentEvent).then((response) => {
      if (response.success) {
        this._toastService.showSuccess('Appointment created successfully');
        this.router.navigate(['/agenda']);
      } else {
        this._toastService.showError('Error creating appointment');
        console.error('Error creating appointment', response.message);
      }
    });
  };

  cancelAppointment() {
    this.router.navigate(['/agenda']);
  }

  ngOnDestroy(): void {
    console.log('New event component destroyed');
  }

}
