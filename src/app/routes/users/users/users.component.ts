import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

// Components
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { SearchInputComponent } from 'src/app/shared/components/form/inputs/search-input/search-input.component';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';

// Services
import { AuthService } from '../../../core/services/auth/auth.service';
import { UserService } from '../../../core/services/user/user.service';
import { ToastService } from 'src/app/shared/services/toast.service';

// Interfaces
import { User } from 'src/app/core/interfaces/User';
import { Response } from 'src/app/core/interfaces/Response';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [SearchInputComponent, RouterLink, DialogComponent, SpinnerComponent, FormsModule, SelectButtonModule],
})

export class UsersComponent implements OnInit {
  users: User[] = [];
  originalUsers: User[] = [];
  searchTerm: string = '';
  currentUser: any = '';
  isLoading = false;
  isDialogOpen = false;
  userSelected: User = {} as User;
  stateOptions: any[] = [{ label: 'Mis pacientes', value: 'patients' }, { label: 'Usuarios', value: 'users' }];
  stateOptionsUser: any[] = [{ label: 'Mis enfermeros', value: 'myNurses' }, { label: 'Otros enfermeros', value: 'allNurses' }];
  value: string = 'patients';
  userValue: string = 'myNurses';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toasteService: ToastService
  ) { }

  ngOnInit() {
    this.authService.getCurrentUser().then((user) => {
      this.currentUser = user;
      this.loadUsers();
    });
  }

  loadUsers() {
    if (this.value === 'patients') {
      this.getRelatedUsers();
    } else {
      this.getUsers();
    }
  }

  loadNurses() {
    if (this.userValue === 'myNurses') {
      this.getRelatedUsers();
    } else {
      this.getNurses();
    }
  }

  formatUser(user: any): string {
    return JSON.stringify(user, null, 2);
  }

  async getUsers() {
    this.isLoading = true;

    const response: Response = await this.userService.getUsers();
    if (response.success) {
      this.users = response.data as User[];
      this.originalUsers = [...this.users];
      this.isLoading = false;
    } else {
      this.users = [];
      this.isLoading = false;
    }
  }

  async getNurses() {
    this.isLoading = true;

    let response: Response = await this.userService.getUsers();
    if (response.success) {
      response.data = response.data.filter((user: User) => user.role === 'admin');
      console.log(response.data);
      this.users = response.data as User[];
      this.originalUsers = [...this.users];
      this.isLoading = false;
    } else {
      this.users = [];
      this.isLoading = false;
    }
  }

  async getRelatedUsers() {
    this.isLoading = true;
    const response: Response = await this.userService.getUsersByListUID(this.currentUser.uid);
    if (response.success) {
      this.users = response.data as User[];
      this.originalUsers = [...this.users];
      this.isLoading = false;
    } else {
      this.users = [];
      this.isLoading = false;
    }
  }

  onSearchInputChange(searchTerm: string) {
    if (searchTerm) {
      this.users = this.originalUsers.filter(user => {
        return user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.identification!.includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase());
      });
    } else {
      this.users = [...this.originalUsers];
    }
  }

  async unlink() {
    const response: Response = await this.userService.unlinkUsers(this.currentUser, this.userSelected);
    if (response.success) {
      this.getRelatedUsers();
      this.handleDialogClose();
    } else {
      console.error(response.message);
      this.toasteService.showError("No se pudo desvincular el usuario. Intente nuevamente.");
    }

  }

  openDialog(user: User) {
    this.isDialogOpen = true;
    this.userSelected = user;
  }

  handleDialogClose() {
    this.isDialogOpen = false;
  }

  selectButtonChange(event: any) {
    this.value = event.option.value;
    this.loadUsers();
  }

  userSelectButtonChange(event: any) {
    this.userValue = event.option.value;
    this.loadNurses();
  }
}
