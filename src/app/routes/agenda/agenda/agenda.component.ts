import { Component, OnInit } from '@angular/core';

import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { DialogModule } from 'primeng/dialog';
import { CalendarComponent } from 'src/app/shared/components/calendar/calendar.component';
import { Router } from '@angular/router';
import { User } from 'src/app/core/interfaces/User';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss'],
  standalone: true,
  imports: [DialogComponent, DialogModule, CalendarComponent],
})
export class AgendaComponent implements OnInit {
  user: User | null = null;
  dateSelected: any

  constructor(private router: Router) { }

  ngOnInit() {
    console.log('Agenda component loaded');
  }


  onDayClicked(event: any) {
    console.log('Day clicked123123', event);
    this.router.navigate(['/agenda/new-event', new Date(event).getTime()]);
  }


  scheduleAppointment() {
    console.log('Appointment scheduled');
  }
}
