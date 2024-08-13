import { Component, OnInit, OnDestroy } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { subMinutes } from 'date-fns';

import { AppointmentService } from 'src/app/core/services/appointment/appointment.service';
import { UserService } from 'src/app/core/services/user/user.service';

import { Response } from 'src/app/core/interfaces/Response';

@Component({
  selector: 'app-today-schedule-widget',
  templateUrl: './today-schedule-widget.component.html',
  styleUrls: ['./today-schedule-widget.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class TodayScheduleWidgetComponent implements OnInit, OnDestroy {
  appointments: any[] = [];
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
  }

  async getUser() {
    const response: Response = await this.userService.getUserById(this.userId);
    if (response.success) {
      this.user = response.data;
    }
  }

  async getAppointments() {
    this.appointmentService.getAppointmentsByDoctor(this.userId).then((response: Response) => {
      if (response.success) {
        this.appointments = response.data.filter(
          (appointment: any) => this.isTodayAndUpcoming(appointment)
        );
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  private isTodayAndUpcoming(appointment: any): boolean {
    const appointmentDate = appointment.datetime.split('T')[0];
    const appointmentTime = appointment.datetime.split('T')[1].split('.')[0];

    const currentDate = subMinutes(
      new Date().toISOString(),
      new Date().getTimezoneOffset())
      .toISOString().split('T')[0];
    const currentTime = subMinutes(
      new Date().toISOString(),
      new Date().getTimezoneOffset())
      .toISOString().split('T')[1].split('.')[0];

    if (appointmentDate === currentDate) {
      if (appointmentTime >= currentTime) {
        return true;
      }
    }
    return false;
  }
}