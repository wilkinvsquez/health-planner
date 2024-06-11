import {
  AfterViewInit,
  Component,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

import { User } from 'firebase/auth';
import { filter } from 'rxjs/operators';

import { IonIcon } from '@ionic/angular/standalone';

import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [IonIcon, RouterLink, RouterLinkActive],
})
export class NavbarComponent implements AfterViewInit, OnInit {
  @ViewChildren('navLink') navLinks!: QueryList<any>;
  formattedName: string = '';
  user: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.user.subscribe((user: User) => {
      if (user) {
        this.user = user;
        const { name, lastname = '' } = this.user;
        this.formattedName = `${name} ${lastname.split(' ')[0]}`;
      } else {
        this.getCurrentUser();
      }
    });
  }
  async loadUser() {}

  async getCurrentUser() {
    await this.authService.getCurrentUser().then((res) => {
      if (res) {
        this.user = res;
        this;
        const { name, lastname = '' } = this.user;
        this.formattedName = `${name} ${lastname.split(' ')[0]}`;
      } else {
        this.user = '';
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
