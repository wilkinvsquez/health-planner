import {
  Component,
  OnInit,
} from '@angular/core';

import {
  CustomInputComponent,
} from 'src/app/shared/components/form/inputs/custom-input/custom-input.component';
import {
  NotesComponent,
} from 'src/app/shared/components/notes/notes.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  standalone: true,
  imports: [CustomInputComponent, NotesComponent],
})
export class UserComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
