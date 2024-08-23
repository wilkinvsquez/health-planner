import { Component, OnInit, OnDestroy } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { subMinutes } from 'date-fns';

import { SidebarModule } from 'primeng/sidebar';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';

import { AppointmentService } from 'src/app/core/services/appointment/appointment.service';
import { UserService } from 'src/app/core/services/user/user.service';

import { Response } from 'src/app/core/interfaces/Response';
import { SidebarComponent } from '../../sidebar/sidebar.component';

import {
  SearchInputComponent,
} from '../../form/inputs/search-input/search-input.component';
import { and } from 'firebase/firestore';

@Component({
  selector: 'app-appointment-filter',
  templateUrl: './appointment-filter.component.html',
  styleUrls: ['./appointment-filter.component.scss'],
  standalone: true,
  imports: [
    SearchInputComponent,
    CommonModule,
    SidebarModule,
    SidebarComponent,
    FormsModule,
    CalendarModule
  ],
})
export class AppointmentFilterComponent implements OnInit, OnDestroy {
  sidebarVisible: boolean = false;
  rangeDates: Date[] = [];
  selectedDates = { startDate: '', endDate: '' };
  selectedAppointment: any;
  appointments: any[] = [];
  originalAppointments: any[] = [];
  searchTerm: string = '';
  userId: string = '';
  user: any = {};

  constructor(
    private appointmentService: AppointmentService,
    private userService: UserService,
    private router: Router,
  ) {
    this.userId = getAuth().currentUser?.uid ?? '';
  }

  ngOnInit() {
    this.getUser().then(() => {
      if (!this.user) {
        this.router.navigate(['/not-found']);
      } else {
        this.getAppointments();
      }
    });
  }

  ngOnDestroy(): void {
    this.appointments = [];
    this.user = {};
    this.userId = '';
    this.searchTerm = '';
    this.originalAppointments = [];
  }

  async getUser() {
    const response: Response = await this.userService.getUserById(this.userId);
    if (response.success) {
      this.user = response.data;
    }
  }

  async getAppointments() {
    try {
      const response = this.user.role == 'admin' ? 
      await this.appointmentService.getAppointmentsByDoctor(this.userId) 
      : await this.appointmentService.getAppointmentsByPatient(this.userId);

      if (response.success) {
        const shortAddressRegex = /([A-Z]{2}|[A-Z]{1}[0-9]{1}),\s(.*)/;

        this.appointments = response.data.reduce((acc: any, appointment: any) => {
          if (this.isTodayAndUpcoming(appointment)) {
            const shortAddress = this.extractShortAddress(appointment.location.address, shortAddressRegex);
            acc.push({ ...appointment, shortAddress });
          }
          return acc;
        }, [])
          .sort((a: any, b: any) => {
            return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
          });

        this.originalAppointments = [...this.appointments];
      }
    } catch (error) {
      console.error(error);
    }
  }

  private extractShortAddress(address: any, regex: any) {
    const match = address?.match(regex);
    return match ? match[2] : address;
  }

  private isTodayAndUpcoming(appointment: any): boolean {
    const appointmentDate = appointment.datetime.split('T')[0];

    const currentDate = subMinutes(
      new Date().toISOString(),
      new Date().getTimezoneOffset())
      .toISOString().split('T')[0];

    if (appointmentDate >= currentDate) {
      return true;
    }
    return false;
  }

  onSearchInputChange(searchTerm: string) {
    if (searchTerm) {
      this.appointments = this.originalAppointments.filter(appointment => {
        return appointment.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.patient.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.shortAddress.toLowerCase().includes(searchTerm.toLowerCase());
      });
    } else {
      this.appointments = [...this.originalAppointments];
    }
  }

  onAppointmentClicked(appointment: any) {
    if (!appointment) return;
    this.sidebarVisible = true;
    this.selectedAppointment = appointment;
  }

  onDateRangeChange(event: any) {
    if (event) {
      let selectedDate = event;

      if (this.selectedDates.startDate != '' && this.selectedDates.endDate != '') {
        this.clearDateRange();
      }

      if (this.selectedDates.startDate == '' && this.selectedDates.endDate == '') {
        this.singleDateSelected(selectedDate);
      }

      if (this.selectedDates.startDate != '' && this.selectedDates.endDate == '') {
        if (this.selectedDates.startDate < selectedDate.toISOString().split('T')[0]) {
          this.rangeDateSelected(selectedDate);
        } else {
          this.clearDateRange();
          this.singleDateSelected(selectedDate);
        }
      }

    } else {
      this.appointments = [...this.originalAppointments];
    }
  }

  onClearRangeSearch() {
    this.clearDateRange();
    this.appointments = [...this.originalAppointments];
  }

  clearDateRange() {
    this.selectedDates.startDate = '';
    this.selectedDates.endDate = '';
  }

  singleDateSelected(selectedDate: any) {
    this.selectedDates.startDate = selectedDate.toISOString().split('T')[0];

    this.appointments = this.originalAppointments.filter(appointment => {
      let appointmentDate = new Date(appointment.datetime).toISOString().split('T')[0];
      return appointmentDate === this.selectedDates.startDate;
    });
  }

  rangeDateSelected(selectedDate: any) {
    this.selectedDates.endDate = selectedDate.toISOString().split('T')[0];

    this.appointments = this.originalAppointments.filter(appointment => {
      let appointmentDate = new Date(appointment.datetime).toISOString().split('T')[0];
      return appointmentDate >= this.selectedDates.startDate && appointmentDate <= this.selectedDates.endDate;
    });
  }
}
