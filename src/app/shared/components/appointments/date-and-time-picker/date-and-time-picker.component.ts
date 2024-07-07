import { Component, EventEmitter, OnInit, Output, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { setTimeToDate } from 'src/app/shared/utils/dateFormater';

@Component({
  selector: 'app-date-and-time-picker',
  templateUrl: './date-and-time-picker.component.html',
  styleUrls: ['./date-and-time-picker.component.scss'],
  standalone: true,
  imports: [CalendarModule, FormsModule, DropdownModule],
})
export class DateAndTimePickerComponent implements OnInit {
  @Output() dateSelected: EventEmitter<any> = new EventEmitter();
  minDate: Date;
  day: number = 0;
  selectedDate: string | null = null;
  selectedTime: string | null = null;
  availableTimes: { label: string; value: string }[] = [];
  // disabledDatesArr = [];
  constructor() {
    this.minDate = new Date();
    this.selectedDate = new Date().toISOString();
    this.updateAvailableTimes(new Date(this.selectedDate).getDay());
  }

  ngOnInit() {
    this.updateAvailableTimes(new Date(this.selectedDate!).getDay());
  }

  onDateClick(event: any) {
    const selectedDay = event;
    this.updateAvailableTimes(selectedDay);
  }

  onTimeSelected() {
    this.selectedDate = setTimeToDate(
      this.selectedDate!,
      this.selectedTime!.toString()
    ).toISOString();
    this.dateSelected.emit(this.selectedDate);
  }

  updateAvailableTimes(day: number): void {
    // Ejemplo de horarios basados en el día de la semana
    switch (day) {
      case 0: // Domingo
        this.availableTimes = [
          { label: '10:00', value: '09:00 AM' },
          { label: '10:00', value: '10:00 AM' },
          { label: '11:00', value: '11:00 AM' },
        ];
        break;
      case 1: // Lunes
        this.availableTimes = [
          { label: '09:00', value: '09:00 AM' },
          { label: '10:00', value: '10:00 AM' },
          { label: '11:00', value: '11:00 AM' },
          { label: '13:00', value: '01:00 PM' },
          { label: '14:00', value: '02:00 PM' },
        ];
        break;
      // Agrega más casos según los días de la semana
      default:
        this.availableTimes = [
          { label: '08:00', value: '08:00 AM' },
          { label: '09:00', value: '09:00 AM' },
          { label: '10:00', value: '10:00 AM' },
          { label: '11:00', value: '11:00 AM' },
          { label: '13:00', value: '01:00 PM' },
          { label: '14:00', value: '02:00 PM' },
          { label: '15:00', value: '03:00 PM' },
          { label: '16:00', value: '04:00 PM' },
        ];
        break;
    }
  }
}
