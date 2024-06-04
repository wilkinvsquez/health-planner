import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-today-schedule-widget',
  templateUrl: './today-schedule-widget.component.html',
  styleUrls: ['./today-schedule-widget.component.scss'],
  standalone: true,
})
export class TodayScheduleWidgetComponent  implements OnInit {
  appointments: any[] = [];

  constructor() { }

  ngOnInit() {
    this.appointments = [
      { patientName: "Minor", location: "Quesada, San Carlos", date: "2021-10-15", time: "10:00" },
      { patientName: "Wilkin", location: "Quesada, San Carlos", date: "2021-10-15", time: "12:00" },
      { patientName: "Jorge", location: "Quesada, San Carlos", date: "2021-10-15", time: "14:00" }
    ];
  }

}
