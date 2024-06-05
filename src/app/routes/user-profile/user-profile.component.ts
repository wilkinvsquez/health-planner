import { Component, OnInit } from '@angular/core';

import { User } from 'src/app/core/interfaces/User';
import { UserService } from 'src/app/core/services/user/user.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ToastService } from 'src/app/shared/services/toast.service';

import {
  UserInfoFormComponent
}  from 'src/app/shared/components/form/user-info-form/user-info-form.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: true,
  imports: [
    UserInfoFormComponent,
  ],
})
export class UserProfileComponent implements OnInit {
  inputsEditable = false; // Initial state
  user: any;

  constructor(
    private _userService: UserService,
    private _toastService: ToastService,
    private _authService: AuthService,
  ) {}

  async ngOnInit() {
    const currentUser = await this._authService.getCurrentUser();

    if (currentUser) {
      this.user = currentUser;
    }
  }

  onEditModeChanged(isEditable: boolean) {
    this.inputsEditable = isEditable;
  }

  onUserInfoUpdate(user: User) {
    this._userService.updateUser(this.user.uid ,user).then((response : any) => {
      if (response.error) {
        this._toastService.showError('Error al actulaizar la información');
      }
      this._toastService.showSuccess('Datos actualizados correctamente');
      this.inputsEditable = !this.inputsEditable;
    });
  }

}
