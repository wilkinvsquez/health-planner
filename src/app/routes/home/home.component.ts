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
  TodayScheduleWidgetComponent
} from 'src/app/shared/components/widgets/today-schedule-widget/today-schedule-widget.component';
import { ToastService } from 'src/app/shared/services/toast.service';
import { hasEmptyFields } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, ModalComponent, AppointmentFilterComponent, TodayScheduleWidgetComponent],
})
export class HomeComponent implements OnInit {
  showModal: boolean = false;
  user: any;

  constructor(
    private _authService: AuthService,
    private _toastService: ToastService
  ) { }

  ngOnInit() {
    this.getCurrentUser();
  }

  async getCurrentUser() {
    await this._authService.getCurrentUser().then((res) => {
      if (res) {
        this.user = res;
        if (this.user) {
          this.checkEmptyFields();
        }
      } else {
        this.user = '';
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
      this.openModal();
    } else {
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
