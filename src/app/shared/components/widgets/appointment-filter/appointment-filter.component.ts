import { Component, OnInit, OnDestroy } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppointmentService } from 'src/app/core/services/appointment/appointment.service';
import { UserService } from 'src/app/core/services/user/user.service';

import { Response } from 'src/app/core/interfaces/Response';

import {
  SearchInputComponent,
} from '../../form/inputs/search-input/search-input.component';

@Component({
  selector: 'app-appointment-filter',
  templateUrl: './appointment-filter.component.html',
  styleUrls: ['./appointment-filter.component.scss'],
  standalone: true,
  imports: [SearchInputComponent, CommonModule],
})
export class AppointmentFilterComponent implements OnInit, OnDestroy {
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
        this.appointments = response.data.map((appointment: any) => {
          return {
            ...appointment,
          };
        });
      }
      console.log(this.appointments);
    }).catch((error) => {
      console.log(error);
    });
  }
}
