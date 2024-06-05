import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from 'src/app/core/interfaces/User';
import { UserService } from 'src/app/core/services/user/user.service';
import { CustomInputComponent } from 'src/app/shared/components/form/inputs/custom-input/custom-input.component';
import { NotesComponent } from 'src/app/shared/components/notes/notes.component';
import { CalculateAgePipe } from 'src/app/shared/pipes/calculate-age.pipe';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  standalone: true,
  imports: [CustomInputComponent, NotesComponent, CalculateAgePipe],
})
export class UserComponent implements OnInit {
  id: string = '';
  isLoading = false;
  user: User | any = {};
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.getUser().then(() => {
      if (!this.user) {
        this.router.navigate(['/not-found']);
      }
    });
  }

  async getUser() {
    this.isLoading = true;
    this.user = await this.userService.getUserById(this.id);
    this.isLoading = false;
  }
}
