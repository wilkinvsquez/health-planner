import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { UserService } from 'src/app/core/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [RouterLink],
})
export class LoginComponent implements OnInit {
  constructor(private _userService: UserService) {}

  ngOnInit() {}
}
