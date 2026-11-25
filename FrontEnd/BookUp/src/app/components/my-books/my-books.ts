import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-my-books',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './my-books.html',
  styleUrl: './my-books.css',
})
export class MyBooks {
  isMenuOpen = signal<boolean>(false);

  toggleMenu(): void {
    this.isMenuOpen.update(val => !val);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
