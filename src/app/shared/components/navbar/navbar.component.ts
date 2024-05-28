import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

import { filter } from 'rxjs/operators';

import { AuthService } from '../../../core/services/auth/auth.service';
import { IonIcon } from '@ionic/angular/standalone';

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
    this.getUser();
  }

  async getUser() {
    await this.authService.getCurrentUser().then((res) => {
      if (res) {
        this.user = res;
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
