import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';

import { AuthService } from 'src/app/core/services/auth/auth.service';
import {
  ModalComponent,
} from 'src/app/shared/components/modal/modal.component';
import {
  AppointmentFilterComponent,
} from 'src/app/shared/components/widgets/appointment-filter/appointment-filter.component';
import {
  TodayScheduleWidgetComponent,
} from 'src/app/shared/components/widgets/today-schedule-widget/today-schedule-widget.component';
import { ToastService } from 'src/app/shared/services/toast.service';
import { hasEmptyFields } from 'src/app/shared/utils/utils';

import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    AppointmentFilterComponent,
    TodayScheduleWidgetComponent,
    SpinnerComponent,
  ],
})
export class HomeComponent implements OnInit {
  isLoaded: boolean = false;
  showModal: boolean = false;
  user: any;

  constructor(
    private _authService: AuthService,
    private _toastService: ToastService
  ) { }

  ngOnInit() {
    this._authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.checkEmptyFields();
      } else {
        this._authService.getCurrentUser().then((user) => {
          this.user = user;
          this.checkEmptyFields();
        });
      }
    });
  }

  /**
   * The function `checkEmptyFields` checks if any fields in the user object are empty and displays a
   * warning message if so.
   * @returns Nothing is being returned explicitly in the `checkEmptyFields` function. If the
   * `hasEmptyFields` function returns true, a warning message will be shown using
   * `_toastService.showWarning`. Otherwise, the function will return undefined.
   */
  checkEmptyFields() {
    if (hasEmptyFields(this.user)) {
      this._toastService.showWarning('Completa la información de tu perfil');
      this.isLoaded = true;
      this.openModal();
    } else {
      this.isLoaded = true;
      return;
    }
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}
