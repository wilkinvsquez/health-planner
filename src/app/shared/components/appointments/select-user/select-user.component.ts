import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Event } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { User } from 'src/app/core/interfaces/User';
import { UserService } from 'src/app/core/services/user/user.service';

@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.component.html',
  styleUrls: ['./select-user.component.scss'],
  standalone: true,
  imports: [DropdownModule, FormsModule],
})
export class SelectUserComponent implements OnInit {
  @Output() selectedUser: EventEmitter<any> = new EventEmitter();
  user: any;

  users: User[] = [];
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.getAllProfessionals();
  }

  onUserSelected() {
    this.selectedUser.emit(this.user);
  }

  getAllProfessionals() {
    this.userService.getProfessionals().then(({ data }) => {
      this.users = data;
    });
  }
}
