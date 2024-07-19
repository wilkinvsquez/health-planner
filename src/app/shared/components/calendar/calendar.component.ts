import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { CalendarModule } from 'angular-calendar';
import { MonthViewDay, CalendarEvent, EventAction } from 'calendar-utils';
import { PlacementArray } from 'positioning';
import { EventColor } from 'calendar-utils';

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  startOfHour,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  isSameSecond,
  addMinutes,
  addWeeks,
  startOfMinute,
  startOfYear,
  endOfYear,
  addMonths,
  startOfSecond,
  endOfMinute,
} from 'date-fns';
import { CalendarEventActionsComponent } from 'angular-calendar/modules/common/calendar-event-actions/calendar-event-actions.component';
// import { isWithinThreshold, trackByEventId } from '../../../../../node_modules/angular-calendar/modules/common/util/util';
const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#2c698d',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
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
  @Output() dayClicked: EventEmitter<{ day: MonthViewDay }> = new EventEmitter<{ day: MonthViewDay }>();
  viewDate: Date = new Date();
  events: CalendarEvent[] = [
    // {
    //   title: 'Wilkin Vasquez',
    //   start: new Date('2024-07-13T11:00:00.000Z'),
    //   end: new Date('2024-07-13T12:00:00.000Z'),
    //   color: colors['blue'],
    //   cssClass: 'event',
    //   meta: { increment: 1 },
    //   draggable: false,
    //   allDay: false,

    // },
  ];

  selectedView: any = "month";
  dayStartHour: number = 7;
  dayEndHour: number = 16;

  constructor() { }

  ngOnInit() { }

  displayEvent() {
    console.log('Event clicked');
  }

  onDayClicked({ day }: any) {
    this.dayClicked.emit(day.date.toISOString());
  }

  selectView(view: string) {
    this.selectedView = view as string;
  }
}
