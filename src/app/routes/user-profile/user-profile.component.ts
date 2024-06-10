import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { User } from 'src/app/core/interfaces/User';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { UserInfoFormComponent } from 'src/app/shared/components/form/user-info-form/user-info-form.component';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: true,
  imports: [UserInfoFormComponent, SpinnerComponent],
})
export class UserProfileComponent implements OnInit {
  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef<HTMLInputElement>;
  inputsEditable = false; // Initial state
  user: any;
  isLoading: boolean = true;

  constructor(
    private _userService: UserService,
    private _toastService: ToastService,
    private _authService: AuthService,
    private _storageService: StorageService
  ) {}

  ngOnInit() {
    this._authService.getCurrentUser().then((user) => {
      this.isLoading = false;
      this.user = user;
      this._authService.setUser(user);
    });
  }

  onButtonClick(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    } else {
      console.error('File input is not available.');
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      const file = input.files[0];
      this.handleFile(file);
    } else {
      console.error('No file selected or file input is null.');
    }
  }

  handleFile(file: File): void {
    this._storageService
      .uploadFile(file, `hpl_users/${this.user.uid}`)
      .then((res) => {
        this.user.photoURL = res;
        this._userService
          .updateUser(this.user.uid, this.user)
          .then((response: any) => {
            this._toastService.showSuccess('Imagen subida correctamente');
          });
      })
      .catch((error: any) => {
        console.log(error);
        this._toastService.showError('Error al subir la imagen');
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
