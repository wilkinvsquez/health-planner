import { CommonModule } from '@angular/common';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { environment } from 'src/environments/environment';

import { IonApp, IonContent, IonHeader, IonRouterOutlet, Platform } from '@ionic/angular/standalone';

import { NavbarComponent } from './shared/components/navbar/navbar.component';

import { registerLocaleData } from '@angular/common';
import localeEsCR from '@angular/common/locales/es-CR';
import { SpinnerComponent } from "./shared/components/spinner/spinner.component";
registerLocaleData(localeEsCR, 'es-CR');

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
    SpinnerComponent
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es-CR' }],
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private platform: Platform) {
    this.initializeApp();
  }

  ngOnInit() {
    this.platform.ready().then(async () => {
      if (this.platform.is('android')) {
        Geolocation.requestPermissions();
      }
    });
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
