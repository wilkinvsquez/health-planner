import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, OnInit, Output, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CalendarModule, CalendarMonthViewDay, CalendarView } from 'angular-calendar';
import { MonthViewDay, CalendarEvent } from 'calendar-utils';
import { EventColor } from 'calendar-utils';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { addMinutes, subDays } from 'date-fns';
import { HttpClient } from '@angular/common/http';

import { Holiday } from 'src/app/core/interfaces/Holiday';

registerLocaleData(localeEs);

type CalendarEventWithMeta = CalendarEvent<
  { type: 'holiday'; holiday: Holiday } | { type: 'normal' }
>;

const COUNTRY_CODE = 'CR';

import { addHours, intlFormat, set } from 'date-fns';
import { Calendar } from 'primeng/calendar';
const colors: Record<string, EventColor> = {
  blue: {
    primary: '#2c698d',
    secondary: '#D1E8FF',
  },
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CalendarModule, CommonModule],
})
export class CalendarComponent implements OnInit {
  @Output() dateClicked: EventEmitter<{ day: MonthViewDay }> = new EventEmitter<{ day: MonthViewDay }>();
  viewDate: Date = new Date();
  dayStartHour: number = 7;
  dayEndHour: number = 17;
  CalendarView = CalendarView;
  view: CalendarView = CalendarView.Week;
  activeDayIsOpen: boolean = true;
  events: CalendarEvent[] = [];
  // events: CalendarEventWithMeta[] = [];
  holidays: CalendarEventWithMeta[] = [];
  eventHeight: number = 4;
  cellHeight: number = 4;

  hour: number = 7;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setCalendarView(event.target.innerWidth);
  }

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.fetchHolidays();
    this.setCalendarView(window.innerWidth);
    const start = set(new Date(), { year: 2024, month: 6, date: 22, hours: this.hour, minutes: 0, seconds: 0, milliseconds: 0 });
    this.calculateTop(start)
    this.events.push({
      title: 'Wilkin Vasquez',
      start: set(new Date(), { year: 2024, month: 6, date: 22, hours: this.hour, minutes: 0, seconds: 0, milliseconds: 0 }),
      color: colors['blue'],
      cssClass: 'event',
      draggable: false,
      allDay: false,
    });
  }

  dateIsValid(date: Date): boolean {
    return date > subDays(new Date(), 1);
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach((day) => {
      if (!this.dateIsValid(day.date)) {
        day.cssClass = 'cal-disabled';
      }
    });
  }

  private fetchHolidays() {
    this.http
      .get<Holiday[]>(
        `https://date.nager.at/api/v3/PublicHolidays/${new Date().getFullYear()}/${COUNTRY_CODE}`
      )
      .subscribe((holidays) => {
        this.holidays = holidays.map((holiday) => {
          const holidayDate = new Date(holiday.date);
          const timezoneOffset = holidayDate.getTimezoneOffset();

          return {
            title: holiday.localName,
            start: addMinutes(holidayDate, timezoneOffset),
            allDay: true,
            color: colors['blue'],
            meta: {
              type: 'holiday',
              holiday,
            },
          };
        });
        this.events = [...this.events, ...this.holidays];
      });
  }

  calculateTop(start: Date): void {
    const startHour = start.getHours();
    const startMinute = start.getMinutes();
    const hourOffset = startHour - this.dayStartHour;
    const minuteOffset = startMinute / 60;
    let top = (hourOffset + minuteOffset);
    if (top >= 1 && top <= 10) {
      top = top + top + (0.1 * top);
    } else {
      top = top;
    }
    document.documentElement.style.setProperty('--top', `${top}rem`);
  }

  setCalendarView(size: number) {
    if (size <= 600) {
      this.view = CalendarView.Day;
    } else if (size > 600 && size <= 1000) {
      this.view = CalendarView.Week;
    } else {
      this.view = CalendarView.Month;
    }
  }

  displayEvent() {
    console.log('Event clicked');
  }

  onDayClicked({ day }: any) {
    console.log('Day clicked', day);
    this.dateClicked.emit(day.date.toISOString());
  }

  onSegmentClicked({ date }: any) {
    console.log('Segment clicked', date);
    this.dateClicked.emit(date.toISOString());
  }

  setView(view: CalendarView) {
    this.view = view;
  }
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
