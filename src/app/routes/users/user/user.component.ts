import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUIModule } from 'primeng/blockui';
import { PanelModule } from 'primeng/panel';
import { Platform } from '@ionic/angular';

import { UserService } from 'src/app/core/services/user/user.service';

import { CustomInputComponent } from 'src/app/shared/components/form/inputs/custom-input/custom-input.component';
import { NotesComponent } from 'src/app/shared/components/notes/notes.component';
import { CalculateAgePipe } from 'src/app/shared/pipes/calculate-age/calculate-age.pipe';
import { MapComponent } from 'src/app/shared/components/map/map.component';

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
  ],
})
export class UserComponent implements OnInit, OnDestroy {
  id: string = '';
  isLoading = false;
  user: User | any = {};
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private platform: Platform
  ) {
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.getUser().then(() => {
      if (!this.user) {
        this.router.navigate(['/not-found']);
      }
    });
  }

  ngOnDestroy(): void {
    this.isLoading = false;
  }

  /**
   * Retrieves user data from the Firestore database based on the provided user ID.
   */
  async getUser() {
    this.isLoading = true;
    const response: Response = await this.userService.getUserById(this.id);
    if (response.success) {
      this.user = response.data;
      this.user.lat = 10.31765516609182;
      this.user.lng = -84.4239326317688;
    }
    this.isLoading = false;
  }

  onLocationChange(newLocation: google.maps.LatLngLiteral | null) {
    this.user.lat = newLocation?.lat;
    this.user.lng = newLocation?.lng;
  }

  openInGoogleMaps() {
    const userLat = this.user.lat;
    const userLng = this.user.lng;
    let mapUrl: string = '';

    if (this.platform.is('android')) {
      mapUrl = `geo:0,0?q=${userLat},${userLng}`;
    } else {
      mapUrl = `https://www.google.com/maps/search/?api=1&query=${userLat},${userLng}`;
    }

    window.open(mapUrl, '_system');
  }
}
