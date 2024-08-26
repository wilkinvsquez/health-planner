import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlockUIModule } from 'primeng/blockui';
import { PanelModule } from 'primeng/panel';
import { Platform } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { UserService } from 'src/app/core/services/user/user.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { AppointmentService } from 'src/app/core/services/appointment/appointment.service';

import { CustomInputComponent } from 'src/app/shared/components/form/inputs/custom-input/custom-input.component';
import { NotesComponent } from 'src/app/shared/components/notes/notes.component';
import { CalculateAgePipe } from 'src/app/shared/pipes/calculate-age/calculate-age.pipe';
import { MapComponent } from 'src/app/shared/components/map/map.component';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';

// Interfaces
import { User } from 'src/app/core/interfaces/User';
import { Response } from 'src/app/core/interfaces/Response';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  standalone: true,
  imports: [
    CustomInputComponent,
    NotesComponent,
    CalculateAgePipe,
    MapComponent,
    BlockUIModule,
    PanelModule,
    SpinnerComponent,
    CommonModule,
  ],
})
export class UserComponent implements OnInit, OnDestroy {
  id: string = '';
  isLoading = false;
  user: User | any = {};
  currentUser: User | any = {};
  previousAppointment: any = {} || null;
  nextAppointment: any = {} || null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private platform: Platform,
    private appointmentService: AppointmentService,
  ) {
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.getUser(this.id).then((user) => {
      this.user = user;
    });
    this.getCurrentUser().then(() => {
      this.getAppointments();
    });
  }

  ngOnDestroy(): void {
    this.isLoading = false;
    this.user = {};
    this.currentUser = {};
    this.id = '';
  }

  /**
   * Retrieves user data from the Firestore database based on the provided user ID.
   */
  async getUser(id: string = '') {
    this.isLoading = true;
    const response: Response = await this.userService.getUserById(id);
    if (response.success) {
      this.isLoading = false;
      return response.data;
    }
    this.isLoading = false;
  }

  async getCurrentUser() {
    await this.authService.getCurrentUser().then((user: any) => {
      this.currentUser = user;
    });
  }

  async getAppointments() {
    const appointments = (await this.appointmentService.getAppointmentsByPatient(this.id)).data.filter((appointment: any) =>
      appointment.professional.uid === this.currentUser.uid
    );
    const today = new Date().toISOString();

    const previousAppointments = appointments.filter((appointment: any) =>
      new Date(appointment.datetime).toISOString() < today
    );
    const futureAppointments = appointments.filter((appointment: any) =>
      new Date(appointment.datetime).toISOString() > today
    );

    previousAppointments.sort((a: any, b: any) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
    futureAppointments.sort((a: any, b: any) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

    this.previousAppointment = previousAppointments.length > 0 ? previousAppointments[0] : null;
    this.nextAppointment = futureAppointments.length > 0 ? futureAppointments[0] : null;
  }

  onLocationChange(newLocation: google.maps.LatLngLiteral | null) {
    this.user.lat = newLocation?.lat;
    this.user.lng = newLocation?.lng;
  }

  openInGoogleMaps() {
    const userLat = this.user?.lat ?? 0;
    const userLng = this.user?.lng ?? 0;
    let mapUrl: string = '';

    if (this.platform.is('android')) {
      mapUrl = `geo:0,0?q=${userLat},${userLng}`;
    } else {
      mapUrl = `https://www.google.com/maps/search/?api=1&query=${userLat},${userLng}`;
    }

    window.open(mapUrl, '_system');
  }
}
