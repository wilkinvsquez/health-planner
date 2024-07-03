import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.component.html',
  styleUrls: ['./select-user.component.scss'],
  standalone: true,
  imports: [DropdownModule, FormsModule],
})
export class SelectUserComponent implements OnInit {
  selectedUser: any;
  constructor() {}

  ngOnInit() {}

  users = [
    { nombre: 'Juan Pérez', especialidad: 'Pediatría' },
    { nombre: 'María López', especialidad: 'Cardiología' },
    { nombre: 'Carlos Ruiz', especialidad: 'Geriatría' },
    { nombre: 'Carlos Ruiz', especialidad: 'Geriatría' },
    { nombre: 'Carlos Ruiz', especialidad: 'Geriatría' },
  ];
}
