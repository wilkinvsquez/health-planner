import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, OnInit, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CalendarModule, CalendarMonthViewDay, CalendarView } from 'angular-calendar';
import { MonthViewDay, CalendarEvent } from 'calendar-utils';
import { EventColor } from 'calendar-utils';
import { registerLocaleData } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import localeEs from '@angular/common/locales/es';
import { addMinutes, subDays } from 'date-fns';
import { HttpClient } from '@angular/common/http';
import { getAuth } from 'firebase/auth';

import { AppointmentService } from 'src/app/core/services/appointment/appointment.service';

import { Holiday } from 'src/app/core/interfaces/Holiday';
import { Appointment } from 'src/app/core/interfaces/Appointment';
import { CalendarEventWithMeta } from 'src/app/core/interfaces/CalendarEventWithMeta';

import { SpinnerComponent } from '../spinner/spinner.component';

registerLocaleData(localeEs);

import { addHours, intlFormat, set } from 'date-fns';
import { Calendar } from 'primeng/calendar';
const colors: Record<string, EventColor> = {
  blue: {
    primary: '#2c698d',
    secondary: '#D1E8FF',
  },
};
const COUNTRY_CODE = 'CR';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CalendarModule, CommonModule, SidebarModule, SpinnerComponent],
})
export class CalendarComponent implements OnInit {
  @Output() dateClicked: EventEmitter<{ day: MonthViewDay }> = new EventEmitter<{ day: MonthViewDay }>();
  viewDate: Date = new Date();
  dayStartHour: number = 7;
  dayEndHour: number = 17;
  CalendarView = CalendarView;
  view: CalendarView = CalendarView.Month;
  activeDayIsOpen: boolean = true;
  events: CalendarEvent[] = [];
  userAppointments: CalendarEventWithMeta[] = [];
  holidays: CalendarEventWithMeta[] = [];
  hour: number = 7;
  userId: any = {};
  isLoading: boolean = false;
  sidebarVisible: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setCalendarView(event.target.innerWidth);
  }

  constructor(private http: HttpClient, private _appointmentService: AppointmentService, private cdr: ChangeDetectorRef) {
    this.userId = getAuth().currentUser?.uid;
  }

  async ngOnInit() {
    this.setCalendarView(window.innerWidth);
    this.isLoading = true;
    await this.fetchEvents();
    await this.fetchHolidays();
    // const start = set(new Date(), { year: 2024, month: 6, date: 22, hours: this.hour, minutes: 0, seconds: 0, milliseconds: 0 });
    // this.calculateTop(start)
    this.isLoading = false;
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

  async fetchHolidays() {
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
        this.cdr.markForCheck();
      });
  }

  async fetchEvents() {
    this._appointmentService.getAppointmentsByDoctor(this.userId).then((response) => {
      if (response.success) {
        const appointments = response.data as Appointment[];
        this.userAppointments = appointments.map((appointment) => {
          const appointmentDate = new Date(appointment.datetime);
          const timezoneOffset = appointmentDate.getTimezoneOffset();
          const startDate = addMinutes(appointmentDate, timezoneOffset);
          this.calculateTop(startDate);

          return {
            title: appointment.patient.name + ' ' + appointment.patient.lastname,
            start: startDate,
            allDay: false,
            color: colors['blue'],
            meta: {
              type: 'appointment',
              appointment,
            },
          };
        });
        this.events = [...this.events, ...this.userAppointments];
        this.cdr.markForCheck();
      } else {
        console.log('Error retrieving appointments');
      }
    });
  }

  calculateTop(start: Date): void {
    const startHour = start.getHours();
    const startMinute = start.getMinutes();
    const hourOffset = startHour - this.dayStartHour;
    const minuteOffset = startMinute / 60;
    let top = (hourOffset + minuteOffset);
    if (top >= 1) {
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
    this.sidebarVisible = true;
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
