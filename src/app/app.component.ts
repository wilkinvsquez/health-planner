import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { Platform } from '@ionic/angular';

import { IonApp, IonContent, IonHeader, IonRouterOutlet } from '@ionic/angular/standalone';

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
  ],
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private platform: Platform) { }

  ngOnInit() {
    this.platform.ready().then(async () => {
      if (this.platform.is('android')) {
        Geolocation.requestPermissions();
      }
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
