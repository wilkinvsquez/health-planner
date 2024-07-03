import { Component, OnInit } from '@angular/core';
import { MapComponent } from '../../map/map.component';

@Component({
  selector: 'app-user-summary',
  templateUrl: './user-summary.component.html',
  styleUrls: ['./user-summary.component.scss'],
  standalone: true,
  imports: [MapComponent],
})
export class UserSummaryComponent implements OnInit {
  isEditing = false;
  constructor() {}

  ngOnInit() {}

  editOrCancelUser() {
    this.isEditing = !this.isEditing;
  }
}
