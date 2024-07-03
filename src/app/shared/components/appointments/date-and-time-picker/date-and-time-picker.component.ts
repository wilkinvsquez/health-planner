import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-date-and-time-picker',
  templateUrl: './date-and-time-picker.component.html',
  styleUrls: ['./date-and-time-picker.component.scss'],
  standalone: true,
  imports: [CalendarModule, FormsModule, DropdownModule],
})
export class DateAndTimePickerComponent implements OnInit {
  minDate: Date;
  selectedDate: Date;
  selectedTime: string | null = null;
  availableTimes: { label: string; value: string }[] = [];
  // disabledDatesArr = [];
  constructor() {
    this.minDate = new Date();
    this.selectedDate = new Date();
    this.updateAvailableTimes(this.selectedDate.getDay());
  }

  ngOnInit() {
    this.updateAvailableTimes(this.selectedDate.getDay());
  }

  onDateClick(event: any) {
    const selectedDay = event.getDay();
    this.updateAvailableTimes(selectedDay);
  }

  updateAvailableTimes(day: number): void {
    // Ejemplo de horarios basados en el día de la semana
    switch (day) {
      case 0: // Domingo
        this.availableTimes = [
          { label: '10:00', value: '10:00' },
          { label: '11:00', value: '11:00' },
          { label: '12:00', value: '12:00' },
        ];
        break;
      case 1: // Lunes
        this.availableTimes = [
          { label: '09:00', value: '09:00' },
          { label: '10:00', value: '10:00' },
          { label: '11:00', value: '11:00' },
          { label: '13:00', value: '13:00' },
          { label: '14:00', value: '14:00' },
        ];
        break;
      // Agrega más casos según los días de la semana
      default:
        this.availableTimes = [
          { label: '08:00', value: '08:00' },
          { label: '09:00', value: '09:00' },
          { label: '10:00', value: '10:00' },
          { label: '11:00', value: '11:00' },
          { label: '12:00', value: '12:00' },
          { label: '13:00', value: '13:00' },
          { label: '14:00', value: '14:00' },
          { label: '15:00', value: '15:00' },
          { label: '16:00', value: '16:00' },
        ];
        break;
    }
  }
}
