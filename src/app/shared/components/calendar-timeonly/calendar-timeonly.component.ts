import { Component } from '@angular/core';
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
  time: Date[] | undefined;
}
