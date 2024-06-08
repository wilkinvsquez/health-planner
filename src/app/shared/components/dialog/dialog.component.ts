import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  standalone: true,
})
export class DialogComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Output() closeDialog = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  dismiss() {
    this.isOpen = false;
    this.closeDialog.emit();
  }
}
