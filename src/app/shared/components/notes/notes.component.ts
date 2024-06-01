import {
  Component,
  OnInit,
} from '@angular/core';

import {
  CustomInputComponent,
} from '../form/inputs/custom-input/custom-input.component';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  standalone: true,
  imports: [CustomInputComponent],
})
export class NotesComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
