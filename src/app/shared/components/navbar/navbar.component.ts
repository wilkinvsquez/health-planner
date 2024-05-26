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

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
})
export class NavbarComponent implements AfterViewInit, OnInit {
  private auth: Auth = inject(Auth);
  @ViewChildren('navLink') navLinks!: QueryList<any>;
  user: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.getUser();
  }

  async getUser() {
    await this.authService.getCurrentUser().then((res) => {
      if (res) {
        this.user = res;
      } else {
        this.user = null;
      }
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
