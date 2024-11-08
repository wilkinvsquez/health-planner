import { Component, OnInit, OnDestroy } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { subMinutes } from 'date-fns';

import { SidebarModule } from 'primeng/sidebar';

import { AppointmentService } from 'src/app/core/services/appointment/appointment.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { ToastService } from 'src/app/shared/services/toast.service';

import { Appointment } from 'src/app/core/interfaces/Appointment';

import { Response } from 'src/app/core/interfaces/Response';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-today-schedule-widget',
  templateUrl: './today-schedule-widget.component.html',
  styleUrls: ['./today-schedule-widget.component.scss'],
  standalone: true,
  imports: [CommonModule, SidebarModule, SidebarComponent, DialogComponent],
})
export class TodayScheduleWidgetComponent implements OnInit, OnDestroy {
  sidebarVisible: boolean = false;
  isDialogOpen = false;
  selectedAppointment: any;
  appointments: any[] = [];
  userId: string = '';
  user: any = {};
  appointment: any = {};

  constructor(
    private appointmentService: AppointmentService,
    private userService: UserService,
    private router: Router,
    private toastService: ToastService,
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
    this.sidebarVisible = false;
  }

  async getUser() {
    if (!this.userId) return;
    const response: Response = await this.userService.getUserById(this.userId);
    if (response.success) {
      this.user = response.data;
    }
  }

  async getAppointments() {
    try {
      const response = await this.appointmentService.getAppointmentsByDoctor(this.userId);

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

  onAppointmentClicked(appointment: any) {
    if (!appointment) return;
    this.sidebarVisible = true;
    this.selectedAppointment = appointment;
  }

  onOpenDeleteDialog(appointment: Appointment) {
    this.appointment = appointment;
    this.sidebarVisible = false;
    this.isDialogOpen = true;
  }

  onCloseDialog() {
    this.isDialogOpen = false;
    this.sidebarVisible = false;
  }

  async onDeleteAppointment(appointment: Appointment) {
    if (!appointment) return;
    const response = await this.appointmentService.deleteAppointmentEv(appointment);
    if (response?.success) {
      this.toastService.showSuccess('Su cita ha sido eliminada correctamente');
      this.getAppointments();
    } else {
      this.toastService.showError('Error al eliminar la cita');
    }
    this.onCloseDialog();
  }
}