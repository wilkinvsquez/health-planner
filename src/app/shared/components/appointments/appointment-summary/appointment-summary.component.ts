import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Appointment } from 'src/app/core/interfaces/Appointment';
import { DatePipe } from 'src/app/shared/pipes/date/date.pipe';
import { TimePipe } from 'src/app/shared/pipes/date/time.pipe';
import { SpecialtiesListPipe } from 'src/app/shared/pipes/specialties/specialties-list.pipe';

@Component({
  selector: 'app-appointment-summary',
  templateUrl: './appointment-summary.component.html',
  styleUrls: ['./appointment-summary.component.scss'],
  standalone: true,
  imports: [ButtonModule, DatePipe, TimePipe, SpecialtiesListPipe],
})
export class AppointmentSummaryComponent implements OnInit {
  @Input() appointment: Appointment = {} as Appointment;

  constructor() {}

  ngOnInit() {
    console.log(this.appointment);
  }
}
