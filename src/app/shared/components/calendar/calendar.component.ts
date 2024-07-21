import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { CalendarModule, CalendarView } from 'angular-calendar';
import { MonthViewDay, CalendarEvent } from 'calendar-utils';
import { EventColor } from 'calendar-utils';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);

import { addHours, intlFormat, set } from 'date-fns';
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
  imports: [CalendarModule, CommonModule],
})
export class CalendarComponent implements OnInit {
  @Output() dateClicked: EventEmitter<{ day: MonthViewDay }> = new EventEmitter<{ day: MonthViewDay }>();
  viewDate: Date = new Date();
  dayStartHour: number = 8;
  dayEndHour: number = 17;
  CalendarView = CalendarView;
  view: CalendarView = CalendarView.Week;
  activeDayIsOpen: boolean = true;
  events: CalendarEvent[] = [

  ];

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setCalendarView(event.target.innerWidth);
  }

  constructor() { }

  ngOnInit() {
    this.setCalendarView(window.innerWidth);
    this.events.push({
      title: 'Wilkin Vasquez',
      start: set(new Date(), { year: 2024, month: 6, date: 22, hours: 16, minutes: 0, seconds: 0, milliseconds: 0 }),
      color: colors['blue'],
      cssClass: 'event',
      draggable: false,
      allDay: false,
    });
    console.log('Event Start:', this.events[0]);
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