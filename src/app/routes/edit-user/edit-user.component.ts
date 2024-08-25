import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

import { User } from 'src/app/core/interfaces/User';
import { UserService } from 'src/app/core/services/user/user.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';

import { UserInfoFormComponent, } from 'src/app/shared/components/form/user-info-form/user-info-form.component';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  standalone: true,
  imports: [
    UserInfoFormComponent,
    SpinnerComponent,
    FormsModule,
    DropdownModule,
  ]
})

export class EditUserComponent implements OnInit, OnDestroy {
  inputsEditable = false;
  isLoaded: boolean = false;
  id: string = '';
  user: User | any = {};
  currentUser: User | any = {};
  roles: any[] = [
    { label: 'Paciente', value: 'user' },
    { label: 'Enfermero', value: 'admin' }
  ];
  selectedRole: any = {};

  constructor(
    private route: ActivatedRoute,
    private _toastService: ToastService,
    private _userService: UserService,
    private authService: AuthService,
  ) {
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.authService.getCurrentUser().then((user: any) => {
      this.currentUser = user;
    });
    this.getUser(this.id).then((user) => {
      this.user = user;
      this.selectedRole = {
        label: user.role === 'user' ? 'Paciente' : 'Enfermero',
        value: user.role
      };
    });
  }

  ngOnDestroy(): void {
    this.isLoaded = false;
  }

  async getUser(id: string = '') {
    this.isLoaded = false;
    const response = await this._userService.getUserById(id);
    if (response.success) {
      this.isLoaded = true;
      return response.data;
    }
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
