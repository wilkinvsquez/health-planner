// Angular and RxJS Modules
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';

// Third-party Modules
import { addMinutes, subDays } from 'date-fns';
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

// Components
import { SpinnerComponent } from '../spinner/spinner.component';

//Utils
import { calculateTop } from '../../utils/calculateTopSize';
import { SidebarComponent } from '../sidebar/sidebar.component';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CalendarModule, CommonModule, SidebarModule, SpinnerComponent, SidebarComponent],
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
  isLoading: boolean = false;
  sidebarVisible: boolean = false;
  updatedEvents: any = []
  isEditing: Boolean = false;
  selectedAppointment: any;
  showMarker = false;

  // Window resize listener
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setCalendarView(event.target.innerWidth);
  }

  constructor(
    private http: HttpClient,
    private _appointmentService: AppointmentService,
    private cdr: ChangeDetectorRef,
    private mapService: MapDataService
  ) {
    this.userId = getAuth().currentUser?.uid;
  }

  ngOnInit() {
    this.isLoading = true;
    this.loadAllData();
  }

  // Data loading methods
  loadAllData() {
    const holidaysObservable = this.fetchHolidays();
    const eventsObservable = this.fetchEvents();
    forkJoin([holidaysObservable, eventsObservable])
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.setCalendarView(window.innerWidth);
          this.eventObserver();
          this.cdr.markForCheck();
        })
      )
      .subscribe(
        ([holidays, events]) => {
          this.holidays = holidays;
          this.userAppointments = events;
          this.events = [...this.holidays, ...this.userAppointments];
        },
        error => {
          console.error('Error loading data:', error);
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
    return date > subDays(new Date(), 1);
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

  onDayClicked({ day }: any) {
    this.dateClicked.emit(day.date.toISOString());
  }

  onSegmentClicked({ date }: any) {
    this.dateClicked.emit(date.toISOString());
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
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

      /**
       * const user = this.userService.getUser(this.userId)
       * const appointments = user.appointments
       * const mappedAppointments = appointments.map((appointment: any) => {
       *  return this._appointmentService.getAppointmentById(appointment.uid)
       * })
       * 
       * )
       */
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
    const currentMinute = currentTime.getMinutes();
    const top = (currentHour - this.hour) * 4;
    return top;
  }
}
