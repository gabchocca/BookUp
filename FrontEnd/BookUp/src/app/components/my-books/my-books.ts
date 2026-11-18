import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-my-books',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './my-books.html',
  styleUrl: './my-books.css',
})
export class MyBooks {}
