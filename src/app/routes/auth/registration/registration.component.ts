import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { User } from 'src/app/core/interfaces/User';
import { AuthService } from 'src/app/core/services/auth/auth.service';

import { RegistrationFormComponent } from '../../../shared/components/form/registration-form/registration-form.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  standalone: true,
  imports: [RegistrationFormComponent, RouterLink],
})
export class RegistrationComponent {
  constructor(private _authService: AuthService, private _router: Router) {}

  onRegister(user: User) {
    this._authService.register(user).then((response: any) => {
      if (response.error) {
        console.log(response.error.code);
      } else {
        console.log(response);
        this._router.navigate(['/login']);
      }
    });
  }
}
