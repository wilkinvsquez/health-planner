import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
})
export class ProfileComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

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
