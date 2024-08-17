import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  @Input() availableTimes: { label: string; value: string }[] = [];
  @Input() isReadyForNextStep: boolean = false;
  @Output() dateSelected: EventEmitter<any> = new EventEmitter();
  minDate: Date;
  day: number = 0;
  selectedDate: string | Date | null = null;
  selectedTime: string | null = null;

  // disabledDatesArr = [];
  constructor(private route: ActivatedRoute) {
    this.minDate = new Date();
    this.selectedDate = new Date(Number(this.route.snapshot.params['date']));
  }

  ngOnInit() { }

  onDateClick(event: any) {
    this.selectedTime = null;
    const selectedDay = event;

  }

  onTimeSelected() {
    this.selectedDate = setTimeToDate(
      this.selectedDate!.toString(),
      this.selectedTime!.toString()
    ).toISOString();
    this.dateSelected.emit(this.selectedDate);
  }
}
