import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { Appointment } from 'src/app/core/interfaces/Appointment';
import { User } from 'src/app/core/interfaces/User';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { AddCategoriesComponent } from 'src/app/shared/components/add-categories/add-categories.component';
import { AppointmentSummaryComponent } from 'src/app/shared/components/appointments/appointment-summary/appointment-summary.component';
import { DateAndTimePickerComponent } from 'src/app/shared/components/appointments/date-and-time-picker/date-and-time-picker.component';
import { SelectUserComponent } from 'src/app/shared/components/appointments/select-user/select-user.component';
import { UserSummaryComponent } from 'src/app/shared/components/appointments/user-summary/user-summary.component';
import { MapComponent } from 'src/app/shared/components/map/map.component';

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
    AppointmentSummaryComponent],
})
export class NewEventComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  searchTerm: string = '';

  appointment: Appointment = {} as Appointment;
  constructor(private authService: AuthService, private router: Router) { }

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

  cancelAppointment() {
    this.router.navigate(['/agenda']);
  }

  ngOnDestroy(): void {
    console.log('New event destroyed');
  }

}
