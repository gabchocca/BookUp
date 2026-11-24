import { Component, inject} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  authService = inject(Auth);
  private router = inject(Router);

  logOut(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
