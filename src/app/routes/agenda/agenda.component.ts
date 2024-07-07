import { Component, OnInit } from '@angular/core';

import { User } from 'firebase/auth';
import { ScheduleAppointmentComponent } from 'src/app/shared/components/appointments/schedule-appointment/schedule-appointment.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss'],
  standalone: true,
  imports: [DialogComponent, ScheduleAppointmentComponent, DialogModule],
})
export class AgendaComponent implements OnInit {
  user: User | null = null;
  isDialogOpen: boolean = true;
  stepperVisible: boolean = true;

  constructor() {}

  ngOnInit() {}

  openDialog() {
    this.stepperVisible = false;
    setTimeout(() => (this.stepperVisible = true), 0);
    this.isDialogOpen = true;
  }

  closeDialog() {
    this.isDialogOpen = false;
  }

  resetStepper() {}

  scheduleAppointment() {
    console.log('Appointment scheduled');
  }
}
