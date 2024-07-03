import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-appointment-summary',
  templateUrl: './appointment-summary.component.html',
  styleUrls: ['./appointment-summary.component.scss'],
  standalone: true,
  imports: [ButtonModule],
})
export class AppointmentSummaryComponent implements OnInit {
  @Output() back: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() schedule: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  onBack() {
    this.back.emit();
  }
  onCancel() {
    this.cancel.emit();
  }
  onSchedule() {
    this.schedule.emit();
  }
}
