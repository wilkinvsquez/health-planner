import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { User } from 'src/app/core/interfaces/User';
import { SearchInputComponent } from 'src/app/shared/components/form/inputs/search-input/search-input.component';

import { AuthService } from '../../../core/services/auth/auth.service';
import { UserService } from '../../../core/services/user/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [SearchInputComponent, RouterLink],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  currentUserUid: any = '';
  isLoading = false;

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
      this.currentUserUid = user.uid;
    });
    await this.userService
      .getUsersByListUID(this.currentUserUid)
      .then((users) => {
        this.users = users as User[];
        this.isLoading = false;
      })
      .catch((error) => {
        this.users = [];
        this.isLoading = false;
      });
  }
}
