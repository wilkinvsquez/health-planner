import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { User } from 'src/app/core/interfaces/User';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { LoginFormComponent } from 'src/app/shared/components/form/login-form/login-form.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../styles/auth-styles.component.scss'],
  standalone: true,
  imports: [RouterLink, LoginFormComponent],
})
export class LoginComponent implements OnInit {
  user: any = {};

  constructor(private _authService: AuthService, private _router: Router) {}

  ngOnInit() {}

  onSignIn(user: User) {
    this._authService.signIn(user).then((response: any) => {
      if (response.error) {
        console.log(response.error.code);
      } else {
        const user = response.user;
        this._router.navigate(['/home'], {
          queryParams: { user: JSON.stringify(user) },
        });
      }
    });
  }
}
