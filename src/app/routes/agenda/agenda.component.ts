import { Component, OnInit } from '@angular/core';

import { User } from 'firebase/auth';
import { ScheduleAppointmentComponent } from 'src/app/shared/components/appointments/schedule-appointment/schedule-appointment.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { DialogModule } from 'primeng/dialog';
import { CalendarComponent } from 'src/app/shared/components/calendar/calendar.component';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss'],
  standalone: true,
  imports: [DialogComponent, ScheduleAppointmentComponent, DialogModule, CalendarComponent],
})
export class AgendaComponent implements OnInit {
  user: User | null = null;
  isDialogOpen: boolean = false;
  stepperVisible: boolean = true;
  showScheduleAppointment: boolean = false;
  dateSelected: any

  constructor() { }

  ngOnInit() { }

  openDialog() {
    this.showScheduleAppointment = false;
    setTimeout(() => {
      this.showScheduleAppointment = true;
      this.isDialogOpen = true;
    }, 0);
  }

  closeDialog() {
    this.isDialogOpen = false;
    this.showScheduleAppointment = false;
  }

  onDayClicked(event: any) {
    console.log('Day clicked', event);
    this.dateSelected = event;
    this.isDialogOpen = true;
  }


  scheduleAppointment() {
    console.log('Appointment scheduled');
  }
}
