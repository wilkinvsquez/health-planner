import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-calendar-timeonly',
  templateUrl: './calendar-timeonly.component.html',
  styleUrls: ['./calendar-timeonly.component.scss'],
  standalone: true,
  imports: [FormsModule, CalendarModule]
})
export class CalendarTimeonlyComponent {
  @Output() timeChange = new EventEmitter<Date[]>();
  time: Date[] | undefined;

  constructor() { }

  onTimeChange(time: any) {
    this.time = time;
    this.timeChange.emit(time);
  }
}
