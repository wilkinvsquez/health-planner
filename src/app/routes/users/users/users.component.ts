import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { User } from 'src/app/core/interfaces/User';
import { SearchInputComponent } from 'src/app/shared/components/form/inputs/search-input/search-input.component';

import { AuthService } from '../../../core/services/auth/auth.service';
import { UserService } from '../../../core/services/user/user.service';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [SearchInputComponent, RouterLink, DialogComponent, SpinnerComponent],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  currentUser: any = '';
  isLoading = false;
  isDialogOpen = false;
  userSelected: User = {} as User;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.getRelatedUsers();
  }

  formatUser(user: any): string {
    return JSON.stringify(user, null, 2);
  }

  async getRelatedUsers() {
    this.isLoading = true;
    await this.authService.getCurrentUser().then((user) => {
      this.currentUser = user;
    });
    await this.userService
      .getUsersByListUID(this.currentUser.uid)
      .then((users) => {
        this.users = users as User[];
        this.isLoading = false;
      })
      .catch((error) => {
        this.users = [];
        this.isLoading = false;
      });
  }

  async unlink() {
    await this.userService
      .unlinkUser(this.currentUser, this.userSelected.uid!)
      .then((res) => console.log(res))
      .catch((error) => console.log(error));
    await this.userService
      .unlinkUser(this.userSelected, this.currentUser.uid!)
      .then((res) => console.log(res))
      .catch((error) => console.log(error));

    this.getRelatedUsers();
    this.handleDialogClose();
  }

  openDialog(user: User) {
    this.isDialogOpen = true;
    this.userSelected = user;
  }

  handleDialogClose() {
    this.isDialogOpen = false;
  }
}
