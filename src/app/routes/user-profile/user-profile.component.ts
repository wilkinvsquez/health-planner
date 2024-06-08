import { Component, OnInit } from '@angular/core';

import { User } from 'src/app/core/interfaces/User';
import { UserService } from 'src/app/core/services/user/user.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ToastService } from 'src/app/shared/services/toast.service';

import {
  UserInfoFormComponent
} from 'src/app/shared/components/form/user-info-form/user-info-form.component';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: true,
  imports: [
    UserInfoFormComponent,
    SpinnerComponent
  ],
})
export class UserProfileComponent implements OnInit {
  inputsEditable = false; // Initial state
  user: any
  isLoading: boolean = true;

  constructor(
    private _userService: UserService,
    private _toastService: ToastService,
    private _authService: AuthService,
  ) { }

  ngOnInit() {
    this._authService.getCurrentUser().then(user => {
      this.isLoading = false;
      this.user = user;
    });
  }

  onEditModeChanged(isEditable: boolean) {
    this.inputsEditable = isEditable;
  }

  onUserInfoUpdate(user: User) {
    this._userService.updateUser(this.user.uid, user).then((response: any) => {
      if (response.error) {
        this._toastService.showError('Error al actulaizar la información');
      }
      this._toastService.showSuccess('Datos actualizados correctamente');
      this.inputsEditable = !this.inputsEditable;
    });
  }

}
