import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { User } from 'src/app/core/interfaces/User';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [RouterLink],
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  formattedName: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
        const { name, lastname = '' } = user;
        this.formattedName = `${name} ${lastname.split(' ')[0]}`;
      } else {
        this.authService.getCurrentUser();
      }
    });
  }

  async signOut() {
    await this.authService
      .signOut()
      .then(() => {
        this.router.navigate(['/auth/login']);
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  }
}
