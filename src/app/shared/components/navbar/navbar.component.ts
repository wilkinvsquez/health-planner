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

import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
})
export class NavbarComponent implements AfterViewInit, OnInit {
  @ViewChildren('navLink') navLinks!: QueryList<any>;
  user: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = this.authService.getUser();
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
