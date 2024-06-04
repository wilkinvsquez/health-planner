import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import {
  IonApp,
  IonContent,
  IonHeader,
  IonRouterOutlet,
} from '@ionic/angular/standalone';

import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonApp,
    IonRouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NavbarComponent,
    RouterModule,
    //BrowserAnimationsModule,
  ],
})
export class AppComponent {
  constructor(private router: Router) {}

  isLoginPageOrRegisterPage(): boolean {
    const currentUrl = this.router.url;
    return (
      currentUrl.includes('/auth/login') ||
      currentUrl.includes('/auth/register') ||
      currentUrl.includes('/auth/password-reset')
    );
  }
}
