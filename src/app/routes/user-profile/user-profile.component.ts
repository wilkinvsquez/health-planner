import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

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
    SpinnerComponent,
    RouterLink,
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
    private _router: Router,
  ) { }

  ngOnInit() {
    this._authService.getCurrentUser().then(user => {
      this.user = user;
      this.isLoading = false;
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

  async onUserDelete() {
    try {
      // Delete User from Firebase Authentication and firestore
      await this._authService.deleteUserAccount(this.user.uid).then(async () => {

        // Sign Out
        await this._authService.signOut().then(() => {
          this._router.navigate(['/home']);
          this._toastService.showSuccess('Usuario eliminado correctamente');
        });
      });
    } catch (error) {
      this._toastService.showError('Error al eliminar el usuario');
    }
  }
}
