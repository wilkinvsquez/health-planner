import {
  Component,
  OnInit,
} from '@angular/core';

import { User } from 'firebase/auth';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss'],
  standalone: true,
})
export class AgendaComponent implements OnInit {
  user: User | null = null;
  constructor(private _authService: AuthService) {}

  ngOnInit() {
    this._authService.getCurrentUser().then((user: User) => {
      this.user = user;
    });
  }
}
