import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr/toastr/toastr.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { CustomInputComponent } from 'src/app/shared/components/form/inputs/custom-input/custom-input.component';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
  standalone: true,
  imports: [CustomInputComponent, ReactiveFormsModule, CommonModule],
})
export class PasswordResetComponent implements OnInit {
  passwordResetForm: FormGroup;
  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastrService: ToastrService
  ) {
    this.passwordResetForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {}

  async onSubmit() {
    //console.log(this.passwordResetForm);
    //this.router.navigate(['/auth/login']);

    try {
      await this.authService.sendPasswordResetEmail(
        this.passwordResetForm.value.email
      );

      this.toastrService.success(
        'Correo de recuperación enviado. Por favor, revisa tu bandeja de entrada.',
        'Correo enviado',
        { timeOut: 5000 }
      );
      this.router.navigate(['/auth/login']);
    } catch (error) {
      this.toastrService.error(
        'Error al enviar correo de recuperación. Por favor, inténtalo de nuevo.',
        'Error'
      );
      console.error('Error al enviar correo de recuperación', error);
    }
  }
}
