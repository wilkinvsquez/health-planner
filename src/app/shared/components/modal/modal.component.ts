import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { User } from 'src/app/core/interfaces/User';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { ToastService } from 'src/app/shared/services/toast.service';

import { UserInfoFormComponent } from '../form/user-info-form/user-info-form.component';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [
    UserInfoFormComponent,
    SpinnerComponent,
  ],
})
export class ModalComponent implements OnInit {
  @Input() showModal: boolean = false;
  @Output() closed = new EventEmitter<void>();
  isLoaded: boolean = false;
  inputsEditable = false;
  user: any = {};

  constructor(
    private _userService: UserService,
    private _authService: AuthService,
    private _toastService: ToastService
  ) {}

  async ngOnInit() {
    await this._authService.getCurrentUser().then((res) => {
      this.user = res;
      this.isLoaded = true;
    });
  }

  onUserInfoUpdate(user: User) {
    this.isLoaded = false;
    this._userService.updateUser(this.user.uid ,user).then((response : any) => {
      if (response.error) {
        this._toastService.showError('Error al actulaizar la información');
      }
      this.isLoaded = true;
      this._toastService.showSuccess('Datos actualizados correctamente');
      this.closeModal();
    });
  }

  closeModal() {
    this.closed.emit();
  }
}
