import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-calendar-timeonly',
  templateUrl: './calendar-timeonly.component.html',
  styleUrls: ['./calendar-timeonly.component.scss'],
  standalone: true,
  imports: [FormsModule, CalendarModule]
})
export class CalendarTimeonlyComponent implements OnInit {
  @Input() setTime: string = '';
  @Output() timeChange = new EventEmitter<Date[]>();
  time: Date | undefined;

  constructor() { }

  ngOnInit() {
    this.time = new Date(this.setTime);
  }

  onTimeChange(time: any) {
    this.time = time;
    this.timeChange.emit(time);
  }
}
