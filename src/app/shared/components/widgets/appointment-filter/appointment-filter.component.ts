import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';

import {
  SearchInputComponent,
} from '../../form/inputs/search-input/search-input.component';

@Component({
  selector: 'app-appointment-filter',
  templateUrl: './appointment-filter.component.html',
  styleUrls: ['./appointment-filter.component.scss'],
  standalone: true,
  imports: [SearchInputComponent],
})
export class AppointmentFilterComponent implements OnInit, OnDestroy {
  appointments = [];

  constructor() {}

  ngOnInit() {}

  ngOnDestroy(): void {
    this.appointments = [];
  }
}
