import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  PasswordInputComponent,
} from '../inputs/password-input/password-input.component';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['../styles/form-styles.component.scss'],
  standalone: true,
  imports: [RouterLink, CommonModule, PasswordInputComponent],
})
export class LoginFormComponent implements OnInit {
  passwordFieldType: string = 'password';

  constructor() {}

  ngOnInit() {}

  togglePasswordVisibility(): void {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
