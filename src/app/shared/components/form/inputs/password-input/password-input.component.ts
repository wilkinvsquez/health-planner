import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['../../styles/form-styles.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class PasswordInputComponent {
  passwordFieldType: string = 'password';

  constructor() {}

  togglePasswordVisibility(): void {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
