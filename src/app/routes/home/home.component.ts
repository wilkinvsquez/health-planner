import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';

import { Auth } from '@angular/fire/auth';
import { UserService } from 'src/app/core/services/user/user.service'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class HomeComponent  implements OnInit {
  private auth: Auth = inject(Auth);
  private userService: UserService = inject(UserService);
  user: any;

  constructor() { }

  ngOnInit(): void {
    this.userService.searchUsers(
      this.auth.currentUser!.uid
    )
    .then((res) => {
      this.user = res[0];
      console.log(this.user);
    });
  }
}
