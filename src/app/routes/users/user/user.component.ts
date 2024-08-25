import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlockUIModule } from 'primeng/blockui';
import { PanelModule } from 'primeng/panel';
import { Platform } from '@ionic/angular';
import { getAuth } from 'firebase/auth';

import { UserService } from 'src/app/core/services/user/user.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';

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
  ],
})
export class UserComponent implements OnInit, OnDestroy {
  id: string = '';
  isLoading = false;
  user: User | any = {};
  currentUser: User | any = {};

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private platform: Platform
  ) {
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.authService.getCurrentUser().then((user: any) => {
      this.currentUser = user;
    });
    this.getUser(this.id).then((user) => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    this.isLoading = false;
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
