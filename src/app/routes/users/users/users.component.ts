import { Component, OnInit } from '@angular/core';

import { SearchInputComponent } from 'src/app/shared/components/form/inputs/search-input/search-input.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [SearchInputComponent],
})
export class UsersComponent implements OnInit {
  users = [];
  constructor() {}

  ngOnInit() {}
}
