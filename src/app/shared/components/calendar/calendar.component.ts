// Angular and RxJS Modules
import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';

// Third-party Modules
import {
  subMonths, addMinutes, addMonths, addDays, addWeeks, subDays, subWeeks, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay,
} from 'date-fns';
import { CalendarModule, CalendarMonthViewDay, CalendarView } from 'angular-calendar';
import { getAuth } from 'firebase/auth';
import localeEs from '@angular/common/locales/es';
import { MonthViewDay, CalendarEvent, EventColor } from 'calendar-utils';
import { SidebarModule } from 'primeng/sidebar';

// Interfaces
import { Holiday } from 'src/app/core/interfaces/Holiday';
import { Appointment } from 'src/app/core/interfaces/Appointment';
import { CalendarEventWithMeta } from 'src/app/core/interfaces/CalendarEventWithMeta';

// Services
import { AppointmentService } from 'src/app/core/services/appointment/appointment.service';
import { MapDataService } from '../../services/map-data.service';
import { ToastService } from '../../services/toast.service';

// Components
import { SpinnerComponent } from '../spinner/spinner.component';

//Utils
import { calculateTop } from '../../utils/calculateTopSize';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { UserService } from 'src/app/core/services/user/user.service';
import { convert12to24hour } from 'src/app/shared/utils/conver12to24Hour';
import { DialogComponent } from '../dialog/dialog.component';
type CalendarPeriod = 'day' | 'week' | 'month';

// Register locale data
registerLocaleData(localeEs);

// Constants
const colors: Record<string, EventColor> = {
  blue: {
    primary: '#2c698d',
    secondary: '#D1E8FF',
  },
  holiday: {
    primary: '#ff9800',
    secondary: '#fff3e0',
  },
};
const COUNTRY_CODE = 'CR';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [CalendarModule, CommonModule, SidebarModule, SpinnerComponent, SidebarComponent, DialogComponent],
})
export class CalendarComponent implements OnInit {
  // Outputs
  @Output() dateClicked: EventEmitter<{ day: MonthViewDay }> = new EventEmitter<{ day: MonthViewDay }>();

  // Calendar properties
  viewDate: Date = new Date();
  CalendarView = CalendarView;
  view: CalendarView = CalendarView.Week;
  activeDayIsOpen: boolean = true;
  events: CalendarEvent[] = [];
  userAppointments: CalendarEventWithMeta[] = [];
  holidays: CalendarEventWithMeta[] = [];

  // Other properties
  hour: number = 7;
  userId: any = {};
  dayStartHour: any;
  dayEndHour: any;
  isLoading: boolean = false;
  sidebarVisible: boolean = false;
  updatedEvents: any = []
  isEditing: Boolean = false;
  selectedAppointment: any;
  showMarker = false;
  isDialogOpen = false;
  minDate: Date = subDays(new Date(), 1);
  maxDate: Date = addMonths(new Date(), 1);
  prevBtnDisabled: boolean = false;

  nextBtnDisabled: boolean = false;

  // Window resize listener
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setCalendarView(event.target.innerWidth);
  }

  constructor(
    private http: HttpClient,
    private _appointmentService: AppointmentService,
    private _userService: UserService,
    private mapService: MapDataService,
    private toastService: ToastService
  ) {
    this.userId = getAuth().currentUser?.uid;
    this.dateOrViewChanged();
  }

  ngOnInit() {
    console.log(this.minDate);

    this.isLoading = true;
    this.loadAllData();
  }

  // Data loading methods
  loadAllData() {
    const holidaysObservable = this.fetchHolidays();
    const eventsObservable = this.fetchEvents();
    const settingsObservable = this.fetchSettings();
    forkJoin([holidaysObservable, eventsObservable, settingsObservable])
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.setCalendarView(window.innerWidth);
          this.eventObserver();
        })
      )
      .subscribe(
        ([holidays, events, settings]) => {
          this.holidays = holidays;
          this.userAppointments = events;
          this.hour = Number(convert12to24hour(settings.schedule.start));
          this.dayStartHour = Number(convert12to24hour(settings.schedule.start));
          this.dayEndHour = Number(convert12to24hour(settings.schedule.end));
          this.events = [...this.holidays, ...this.userAppointments];
        },
        error => {
          return error;
        }
      );
  }

  // Event observer method
  async eventObserver() {
    const classesToWatch = this.updatedEvents.map((appointment: any) => appointment.uid);
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const targetElement = mutation.target as HTMLElement;
          const changedClasses = targetElement.classList;
          const matchedClasses = Array.from(changedClasses).filter(cls => classesToWatch.includes(cls));
          if (matchedClasses.length > 0) {
            matchedClasses.forEach(matchedClass => {
              const appointment = this.updatedEvents.find((app: any) => app.uid === matchedClass);
              if (appointment) {
                const top = calculateTop(appointment.startDate);
                targetElement.style.top = `${top}rem`;
              }
            });
          }
        }
      });
    });
    const config = { attributes: true, subtree: true, attributeFilter: ['class'] };
    observer.observe(document.body, config);
  }

  // Date validation method
  dateIsValid(date: Date): boolean {
    return date >= this.minDate && date <= this.maxDate;
  }

  dateOrViewChanged(): void {
    this.prevBtnDisabled = !this.dateIsValid(
      this.endOfPeriod(this.view, this.subPeriod(this.view, this.viewDate, 1))
    );
    this.nextBtnDisabled = !this.dateIsValid(
      this.startOfPeriod(this.view, this.addPeriod(this.view, this.viewDate, 1))
    );
    if (this.viewDate < this.minDate) {
      this.changeDate(this.minDate);
    } else if (this.viewDate > this.maxDate) {
      this.changeDate(this.maxDate);
    }
  }

  increment(): void {
    this.changeDate(this.addPeriod(this.view, this.viewDate, 1));
  }

  decrement(): void {
    this.changeDate(this.subPeriod(this.view, this.viewDate, 1));
  }

  today(): void {
    this.changeDate(new Date());
  }

  endOfPeriod(period: CalendarPeriod, date: Date): Date {
    return {
      day: endOfDay,
      week: endOfWeek,
      month: endOfMonth,
    }[period](date);
  }

  subPeriod(period: CalendarPeriod, date: Date, amount: number): Date {
    return {
      day: subDays,
      week: subWeeks,
      month: subMonths,
    }[period](date, amount);
  }

  startOfPeriod(period: CalendarPeriod, date: Date): Date {
    return {
      day: startOfDay,
      week: startOfWeek,
      month: startOfMonth,
    }[period](date);
  }
  addPeriod(period: CalendarPeriod, date: Date, amount: number): Date {
    return {
      day: addDays,
      week: addWeeks,
      month: addMonths,
    }[period](date, amount);
  }

  changeDate(date: Date): void {
    this.viewDate = date;
    this.dateOrViewChanged();
  }

  // Month view render method
  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach((day) => {
      if (!this.dateIsValid(day.date)) {
        day.cssClass = 'cal-disabled';
      }
    });
  }

  setCalendarView(size: number) {
    if (size <= 600) {
      this.view = CalendarView.Day;
    } else if (size > 600) {
      this.view = CalendarView.Week;
    } else {
      this.view = CalendarView.Month;
    }
  }

  displayEvent(event: any) {
    const { appointment } = event.meta
    if (!appointment) return
    this.sidebarVisible = true;
    if (event && event.meta.appointment) {
      this.selectedAppointment = appointment
    }

    if (this.selectedAppointment.location.lat && this.selectedAppointment.location.lng) {
      let location = {
        lat: this.selectedAppointment.location.lat,
        lng: this.selectedAppointment.location.lng
      }
      this.mapService.updateUserLocation(location);
    }
  }

  async onDeleteAppointment(appointment: Appointment) {
    if (!appointment) return;
    const response = await this._appointmentService.deleteAppointmentEv(appointment);
    if (response?.success) {
      this.loadAllData();
      this.toastService.showSuccess('Su cita ha sido eliminada correctamente');
    } else {
      this.toastService.showError('Error al eliminar la cita');
    }

    this.onCloseDialog();
  }

  onDayClicked({ day }: any) {
    this.dateClicked.emit(day.date.toISOString());
  }

  onOpenDeleteDialog() {
    this.sidebarVisible = false;
    this.isDialogOpen = true;
  }

  onCloseDialog() {
    this.isDialogOpen = false;
  }

  onSegmentClicked({ date }: any) {
    const selectedDate = new Date(date);
    const currentTime = new Date();
    if (selectedDate <= currentTime) {
      this.toastService.showError('No puedes seleccionar una fecha anterior a la actual');
      return;
    }
    this.dateClicked.emit(date.toISOString());
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  fetchSettings(): Observable<any> {
    return new Observable(observer => {
      this._userService.getUserById(this.userId).then(
        (response) => {
          if (response.success && response.data) {
            const settings = response.data.settings;
            observer.next(settings);
            observer.complete();
          } else {
            observer.next(null);
            observer.complete();
          }
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  // Fetch holidays method
  fetchHolidays(): Observable<CalendarEventWithMeta[]> {
    return new Observable(observer => {
      this.http
        .get<Holiday[]>(
          `https://date.nager.at/api/v3/PublicHolidays/${new Date().getFullYear()}/${COUNTRY_CODE}`
        )
        .subscribe(
          (holidays) => {
            const mappedHolidays = holidays.map((holiday) => {
              const holidayDate = new Date(holiday.date);
              const timezoneOffset = holidayDate.getTimezoneOffset();

              return {
                title: holiday.localName,
                start: addMinutes(holidayDate, timezoneOffset),
                allDay: true,
                color: colors['holiday'],
                meta: {
                  type: 'holiday',
                  holiday,
                },
              };
            });
            observer.next(mappedHolidays as any);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  // Fetch events method
  fetchEvents(): Observable<CalendarEventWithMeta[]> {
    return new Observable(observer => {
      this._appointmentService.getAppointmentsByDoctor(this.userId).then(
        (response) => {
          if (response.success && response.data.length > 0) {
            const appointments = response.data as Appointment[];
            const mappedAppointments = appointments.map((appointment: any) => {
              const appointmentDate = new Date(appointment.datetime);
              const timezoneOffset = appointmentDate.getTimezoneOffset();
              const startDate = addMinutes(appointmentDate, timezoneOffset);
              this.updatedEvents.push({ uid: appointment.uid, startDate })
              const event: CalendarEventWithMeta = {
                title: appointment.patient.name + ' ' + appointment.patient.lastname,
                start: addMinutes(appointmentDate, timezoneOffset),
                allDay: false,
                color: colors['blue'],
                cssClass: appointment.uid,
                meta: {
                  type: 'appointment',
                  appointment,
                },
              }
              return event;
            });
            observer.next(mappedAppointments);
            observer.complete();
          } else {
            observer.next([]);
            observer.complete();
          }
        },
        error => {
          observer.error(error);
        }
      );
    });
  }


  calculateMarkerTop() {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const top = (currentHour - this.hour) * 4;
    return top;
  }
}
