import { Component, OnInit, } from '@angular/core';

import { User } from 'firebase/auth';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss'],
  standalone: true,
})
export class AgendaComponent implements OnInit {
  user: User | null = null;
  constructor() { }

  ngOnInit() {

  }


}


