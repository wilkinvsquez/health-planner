import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, RouteReuseStrategy } from '@angular/router';

import { provideToastr } from 'ngx-toastr';

import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { firebaseProviders } from './app/firebase.config';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

//bootstrapApplication(AppComponent).catch((err) => console.error(err));

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),
    provideAnimations(),
    provideToastr({ timeOut: 3000, preventDuplicates: true }),
    firebaseProviders,
  ],
});
