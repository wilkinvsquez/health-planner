import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';

import { filter } from 'rxjs/operators';

// Services
import { AuthService } from '../../../core/services/auth/auth.service';
// Interfaces
import { User } from 'src/app/core/interfaces/User';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
})
export class NavbarComponent implements AfterViewInit, OnInit {
  @ViewChildren('navLink') navLinks!: QueryList<any>;
  formattedName: string = '';
  user: User | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
        const { name, lastname = '' } = user;
        this.formattedName = `${name} ${lastname.split(' ')[0]}`;
      } else {
        if (this.authService.isLoggedIn()) {
          this.authService.getCurrentUser();
        }
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

  ngAfterViewInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveLink();
      });

    this.updateActiveLink();
  }

  updateActiveLink(): void {
    const currentUrl = this.router.url;
    this.navLinks.forEach((link) => {
      const nativeElement = link.nativeElement;
      const linkHref = nativeElement.getAttribute('routerLink');
      if (currentUrl.includes(linkHref)) {
        nativeElement.classList.add('active');
      } else {
        nativeElement.classList.remove('active');
      }
    });
  }
}
