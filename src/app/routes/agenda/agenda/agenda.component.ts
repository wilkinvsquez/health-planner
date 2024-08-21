import { Component, OnInit } from '@angular/core';

import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { DialogModule } from 'primeng/dialog';
import { CalendarComponent } from 'src/app/shared/components/calendar/calendar.component';
import { Router } from '@angular/router';
import { User } from 'src/app/core/interfaces/User';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { getTimeFromDatetime } from 'src/app/shared/utils/getTimeFromDatetime';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss'],
  standalone: true,
  imports: [DialogComponent, DialogModule, CalendarComponent],
})
export class AgendaComponent implements OnInit {
  user: User | null = null;
  currentUser: User | null = null;
  dateSelected: any

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.authService.getCurrentUser().then((user: any) => {
      this.currentUser = user;
    });
  }


  onDayClicked(event: any) {
    this.router.navigate(['/agenda/new-event', new Date(event).getTime()]);
  }


  scheduleAppointment() {
    console.log('Appointment scheduled');
  }
}
