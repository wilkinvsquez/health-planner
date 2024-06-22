import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  Router,
  RouterLink,
} from '@angular/router';

import { User } from 'src/app/core/interfaces/User';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserService } from 'src/app/core/services/user/user.service';
import {
  DialogComponent,
} from 'src/app/shared/components/dialog/dialog.component';
import {
  UserInfoFormComponent,
} from 'src/app/shared/components/form/user-info-form/user-info-form.component';
import {
  SpinnerComponent,
} from 'src/app/shared/components/spinner/spinner.component';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: true,
  imports: [
    UserInfoFormComponent,
    SpinnerComponent,
    DialogComponent,
    RouterLink,
  ],
})
export class UserProfileComponent implements OnInit {
  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef<HTMLInputElement>;

  inputsEditable = false;
  isLoaded: boolean = false;
  isDialogOpen = false;

  user: User | null = null;

  constructor(
    private _userService: UserService,
    private _toastService: ToastService,
    private _authService: AuthService,
    private _storageService: StorageService,
    private _router: Router
  ) { }

  ngOnInit() {
    this._authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
        console.log(this.user);
      }
      this.isLoaded = true;
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
    if (!this.user) return;
    this._storageService
      .uploadFile(file, `hpl_users/${this.user.uid}`)
      .then((res) => {
        this.user!.photoURL = res;
        this._userService.updateUser(this.user!.uid!, this.user).then(() => {
          this._authService.getCurrentUser();
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
    if (!this.user) return;
    this._userService
      .updateUser(this.user!.uid!, user)
      .then((response: any) => {
        if (response.error) {
          this._toastService.showError('Error al actulaizar la información');
        }
        this._toastService.showSuccess('Datos actualizados correctamente');
        this.inputsEditable = !this.inputsEditable;
      });
  }

  async onUserDelete() {
    try {
      this.isLoaded = false;
      // Delete User from Firebase Authentication and firestore
      if (!this.user) return;
      await this._authService
        .deleteUserAccount(this.user!.uid!)
        .then(async () => {
          const response = await this._userService.deleteUser(this.user!.uid!);
          if (response.success) {
            // Sign Out
            await this._authService.signOut().then(() => {
              this._router.navigate(['/auth/login']);
              this._toastService.showSuccess('Usuario eliminado correctamente');
            });
          } else {
            console.log(response.message);
            this._toastService.showError('Error al eliminar el usuario');
          }
        });
    } catch (error) {
      this._toastService.showError('Error al eliminar el usuario');
    }
  }

  openDialog() {
    this.isDialogOpen = true;
  }

  handleDialogClose() {
    this.isDialogOpen = false;
  }
}
