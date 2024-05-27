import { Component, Input, Output, EventEmitter } from '@angular/core';

import {UserInfoFormComponent} from '../form/user-info-form/user-info-form.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [
    UserInfoFormComponent,
  ],
})
export class ModalComponent {
  @Input() showModal: boolean = false;
  @Output() closed = new EventEmitter<void>();

  closeModal() {
    this.closed.emit();
  }

}
