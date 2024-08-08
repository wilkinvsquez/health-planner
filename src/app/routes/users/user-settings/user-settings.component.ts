import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from 'src/app/core/services/user/user.service';

import { User } from 'src/app/core/interfaces/User';
import { Response } from 'src/app/core/interfaces/Response';

import { Options } from '@angular-slider/ngx-slider';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { CalendarTimeonlyComponent } from 'src/app/shared/components/calendar-timeonly/calendar-timeonly.component';


@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  standalone: true,
  imports: [SpinnerComponent, NgxSliderModule, CalendarTimeonlyComponent],
})
export class UserSettingsComponent implements OnInit, OnDestroy {
  id: string = '';
  isLoading = false;
  user: User | any = {};
  sliderValue = 15;
  options: Options = {
    floor: 0,
    ceil: 50,
    animate: true,
  };


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService) {
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
    }
    this.isLoading = false;
  }

  onSliderChange(value: number) {
    this.sliderValue = value;
    this.user.settings.maxDistance = value;
  }
}
