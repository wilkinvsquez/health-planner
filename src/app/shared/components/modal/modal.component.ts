import { Component, Input, Output, EventEmitter } from '@angular/core';

import { User } from 'src/app/core/interfaces/User';
import { UserService } from 'src/app/core/services/user/user.service';
import { ToastService } from 'src/app/shared/services/toast.service';

import {UserInfoFormComponent} from '../form/user-info-form/user-info-form.component';
import { HomeComponent } from 'src/app/routes/home/home.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [
    UserInfoFormComponent,
  ],
})
export class ModalComponent {
  @Input() showModal: boolean = false;
  @Output() closed = new EventEmitter<void>();

  constructor(
    private _userService: UserService,
    private _toastService: ToastService,
    private _homeComponent: HomeComponent,
  ) {}

  onUserInfoUpdate(user: User) {
    this._userService.updateUser(this._homeComponent.user.uid ,user).then((response : any) => {
      if (response.error) {
        this._toastService.showError('Error updating user information');
      }
      this._toastService.showSuccess('User information updated');
    });
  }

  closeModal() {
    this.closed.emit();
  }

}
