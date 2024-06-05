import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { User } from 'src/app/core/interfaces/User';
import { UserService } from 'src/app/core/services/user/user.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ToastService } from 'src/app/shared/services/toast.service';

import {UserInfoFormComponent} from '../form/user-info-form/user-info-form.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [
    UserInfoFormComponent,
  ],
})
export class ModalComponent implements OnInit {
  @Input() showModal: boolean = false;
  @Output() closed = new EventEmitter<void>();
  inputsEditable = false;
  user: any = {};

  constructor(
    private _userService: UserService,
    private _authService: AuthService,
    private _toastService: ToastService,
  ) {}

  async ngOnInit() {
    const currentUser = await this._authService.getCurrentUser();

    if (currentUser) {
      this.user = currentUser;
    }
  }

  onUserInfoUpdate(user: User) {
    this._userService.updateUser(this.user.uid ,user).then((response : any) => {
      if (response.error) {
        this._toastService.showError('Error al actulaizar la información');
      }
      this._toastService.showSuccess('Datos actualizados correctamente');
      this.closeModal();
    });
  }

  closeModal() {
    this.closed.emit();
  }
}
