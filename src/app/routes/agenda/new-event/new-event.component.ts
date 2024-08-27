import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
import { RequestAvailableSlots } from 'src/app/core/interfaces/RequestAvailableSlots';
import { AvailableSlotsService } from 'src/app/core/services/availableSlots/available-slots.service';
import { convert24to12hour } from 'src/app/shared/utils/conver24to12hour';
import { Location as CommonLocation } from '@angular/common';

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
  requestAvailableSlots: RequestAvailableSlots = {} as RequestAvailableSlots;
  availableTimes: { label: string; value: string }[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private _appointmentService: AppointmentService,
    private availableSlots: AvailableSlotsService,
    private _toastService: ToastService,
    private _route: ActivatedRoute,
    private location: CommonLocation
  ) { }

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

  onUserSelected(event: any) {
    this.appointment.patient = event;
    this.requestAvailableSlots.location = { lat: event.lat, lng: event.lng };
  }

  async onProfessionalSelected(event: any) {
    let date = new Date(Number(this._route.snapshot.params['date']));
    date = new Date(date.setHours(0));
    this.appointment.professional = event;
    this.requestAvailableSlots.professional = { uid: event.uid };
    this.requestAvailableSlots.selectedDate = date.toISOString();
    await this.getAvailableSlots();
  }

  async getAvailableSlots() {
    const response = await this.availableSlots.getAvailableSlots(this.requestAvailableSlots);
    if (response.success) {
      this.availableTimes = response.data.map((slot: string) => {
        return { label: convert24to12hour(slot), value: slot };
      });
    } else {
      // this._toastService.showError('Error getting available slots');
      console.error('Error getting available slots', response.message);
    }
  }

  async onDateSelected(date: string) {
    date = new Date(date).toISOString();
    this.appointment.datetime = date;
    this.requestAvailableSlots.selectedDate = date;
    await this.getAvailableSlots();
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
        this.appointment = {} as Appointment;
        this._toastService.showSuccess('Su cita ha sido agendada correctamente');
        this.location.back();
      } else {
        this._toastService.showError('Se ha producido un error al crear la cita');
        console.error('Error creating appointment', response.message);
      }
    });
  };

  cancelAppointment() {
    this.location.back();
  }

  ngOnDestroy(): void {

  }

  isEventValid(): boolean {
    return true;
  }

}
