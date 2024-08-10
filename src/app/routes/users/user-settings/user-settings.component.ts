import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { UserService } from 'src/app/core/services/user/user.service';

import { User } from 'src/app/core/interfaces/User';
import { Response } from 'src/app/core/interfaces/Response';

import { Options } from '@angular-slider/ngx-slider';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { DropdownModule } from 'primeng/dropdown';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { CalendarTimeonlyComponent } from 'src/app/shared/components/calendar-timeonly/calendar-timeonly.component';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  standalone: true,
  imports: [SpinnerComponent, NgxSliderModule, CalendarTimeonlyComponent, DropdownModule, FormsModule],
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
  durations: number[] = [1, 2];
  selectedDuration: number = 1;
  time: Date[] | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private toastService: ToastService,
  ) {
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.getUser().then(() => {
      if (!this.user) {
        this.router.navigate(['/not-found']);
      } else {
        this.sliderValue = this.user.settings.maxDistance;
        this.selectedDuration = this.user.settings.appointmentDuration;
      }
    });
  }

  ngOnDestroy(): void {
    this.isLoading = false;
    this.user = {};
    this.sliderValue = 15;
    this.options = {
      floor: 0,
      ceil: 50,
      animate: true,
    };
    this.durations = [1, 2];
    this.selectedDuration = 1;
    this.time = undefined;
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

  onDurationChange(duration: any) {
    this.selectedDuration = duration.value;
    this.user.settings.appointmentDuration = this.selectedDuration;
  }

  onScheduleTimeStartChange(time: any) {
    const scheduleTimeStart = new Date(time);
    this.user.settings.schedule.start = scheduleTimeStart.toTimeString();
  }

  onScheduleTimeEndChange(time: any) {
    const scheduleTimeEnd = new Date(time);
    this.user.settings.schedule.end = scheduleTimeEnd.toTimeString();
  }

  onLunchTimeStartChange(time: any) {
    const lunchTimeStart = new Date(time);
    this.user.settings.lunchTime = lunchTimeStart.toTimeString();
  }

  onSettingsSubmit() {
    this.isLoading = true;
    this.userService.updateUserDB(this.user, this.user.uid).then(() => {
      this.isLoading = false;
      this.toastService.showSuccess('Configuración actualizada');
    }).catch(() => {
      this.isLoading = false;
      this.toastService.showError('Error al actualizar la configuración');
    });
  }
}
