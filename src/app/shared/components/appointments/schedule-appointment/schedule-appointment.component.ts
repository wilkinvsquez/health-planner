import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MapComponent } from '../../map/map.component';
import { AddCategoriesComponent } from '../../add-categories/add-categories.component';
import { DateAndTimePickerComponent } from '../date-and-time-picker/date-and-time-picker.component';
import { SelectUserComponent } from '../select-user/select-user.component';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { UserSummaryComponent } from '../user-summary/user-summary.component';
import { AppointmentSummaryComponent } from '../appointment-summary/appointment-summary.component';
import { User } from 'src/app/core/interfaces/User';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Appointment } from 'src/app/core/interfaces/Appointment';

@Component({
  selector: 'app-schedule-appointment',
  templateUrl: './schedule-appointment.component.html',
  styleUrls: ['./schedule-appointment.component.scss'],
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
  ],
})
export class ScheduleAppointmentComponent implements OnInit, OnDestroy {
  @Output() closeDialog: EventEmitter<any> = new EventEmitter();
  @Output() scheduleAppointment: EventEmitter<any> = new EventEmitter();
  currentUser: User | null = null;
  searchTerm: string = '';

  appointment: Appointment = {} as Appointment;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
      } else {
        this.authService.getCurrentUser();
      }
    });
  }

  onDateSelected(date: string) {
    this.appointment.datetime = date;
    console.log('appointment', this.appointment);
  }

  onScheduleAppointment() {
    console.log('Cita programada');
  }

  closeDialogs() {
    this.authService.currentUser$.subscribe().unsubscribe();
    this.currentUser = null;
    this.appointment = {} as Appointment;
    console.log('ScheduleAppointmentComponent destroyed');
    this.closeDialog.emit();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    console.log('ScheduleAppointmentComponent destroyed');

    this.closeDialogs();


  }
}
