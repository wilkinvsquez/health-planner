import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserAuth } from 'src/app/core/interfaces/UserAuth';
import { AuthService } from 'src/app/core/services/auth/auth.service';

import { UserService } from 'src/app/core/services/user/user.service';
import { LoginFormComponent } from 'src/app/shared/components/form/login-form/login-form.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../styles/auth-styles.component.scss'],
  standalone: true,
  imports: [RouterLink, LoginFormComponent],
})
export class LoginComponent implements OnInit {
  constructor(private _authService: AuthService, private _router: Router) {}

  ngOnInit() {}

  onLogin(auth: UserAuth) {
    this._authService.login(auth);

    // this._authService.login(auth).then((response: any) => {
    //   if (response.error) {
    //     console.log(response.error.code);
    //   } else {
    //     console.log(response);
    //     this._router.navigate(['/login']);
    //   }
    // });
  }
}
