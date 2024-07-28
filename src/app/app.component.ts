import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { environment } from 'src/environments/environment';

import {
  IonApp,
  IonContent,
  IonHeader,
  IonRouterOutlet,
  Platform,
} from '@ionic/angular/standalone';

import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
    // BrowserAnimationsModule,
  ],
})
export class AppComponent {
  constructor(private router: Router, private platform: Platform) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      GoogleAuth.initialize({
        clientId: environment.clientId,
        scopes: ['email', 'profile'],
        grantOfflineAccess: true,
      })
    });
  }

  isLoginPageOrRegisterPage(): boolean {
    const currentUrl = this.router.url;
    return (
      currentUrl.includes('/auth/login') ||
      currentUrl.includes('/auth/register') ||
      currentUrl.includes('/auth/password-reset')
    );
  }
}
