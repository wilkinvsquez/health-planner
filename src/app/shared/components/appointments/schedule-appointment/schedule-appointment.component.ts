import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { MapComponent } from '../../map/map.component';
import { AddCategoriesComponent } from '../../add-categories/add-categories.component';
import { DateAndTimePickerComponent } from '../date-and-time-picker/date-and-time-picker.component';
import { SelectUserComponent } from '../select-user/select-user.component';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { UserSummaryComponent } from '../user-summary/user-summary.component';
import { AppointmentSummaryComponent } from '../appointment-summary/appointment-summary.component';

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
export class ScheduleAppointmentComponent implements OnInit {
  @Output() closeDialog: EventEmitter<any> = new EventEmitter();
  @Output() scheduleAppointment: EventEmitter<any> = new EventEmitter();
  selectedEnfermero: any;
  searchTerm: string = '';

  constructor() {}

  ngOnInit() {}

  closeDialogs() {
    this.closeDialog.emit();
  }
}
