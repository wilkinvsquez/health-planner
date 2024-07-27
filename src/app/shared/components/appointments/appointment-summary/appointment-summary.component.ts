import { Component, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Appointment } from 'src/app/core/interfaces/Appointment';
import { SpecialtiesListPipe } from 'src/app/shared/pipes/specialties/specialties-list.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-appointment-summary',
  templateUrl: './appointment-summary.component.html',
  styleUrls: ['./appointment-summary.component.scss'],
  standalone: true,
  imports: [ButtonModule, SpecialtiesListPipe, CommonModule],
})
export class AppointmentSummaryComponent implements OnInit {
  @Input() appointment: Appointment = {} as Appointment;

  constructor() { }

  ngOnInit() {
    console.log(this.appointment);
  }
}
