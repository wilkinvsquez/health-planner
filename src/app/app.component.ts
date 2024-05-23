import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonApp,
    IonRouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    //BrowserAnimationsModule,
  ],
})
export class AppComponent {
  constructor() {}
}
