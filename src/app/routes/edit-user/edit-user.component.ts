import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from 'src/app/core/interfaces/User';
import { UserService } from 'src/app/core/services/user/user.service';

import {
  UserInfoFormComponent,
} from 'src/app/shared/components/form/user-info-form/user-info-form.component';
import {
  SpinnerComponent,
} from 'src/app/shared/components/spinner/spinner.component';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  standalone: true,
  imports: [
    UserInfoFormComponent,
    SpinnerComponent,
  ]
})

export class EditUserComponent implements OnInit, OnDestroy {
  inputsEditable = false;
  isLoaded: boolean = false;
  id: string = '';
  user: User | any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _toastService: ToastService,
    private _userService: UserService,
  ) {
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
    this.isLoaded = false;
  }

  async getUser() {
    this.user = (await this._userService.getUserById(this.id)).data;
    this.isLoaded = true;
  }

  onEditModeChanged(isEditable: boolean) {
    this.inputsEditable = isEditable;
  }

  onUserInfoUpdate(user: User) {
    if (!this.id) return;
    this._userService
      .updateUser(this.id, user)
      .then((response: any) => {
        if (response.error) { // Como el correo del paciente no esta verificado, no se puede actualizar la información
          this._toastService.showError('Error al actulaizar la información');
        }
        this._toastService.showSuccess('Datos actualizados correctamente');
        this.inputsEditable = !this.inputsEditable;
      }
      );
  }
}
