import { Component, inject, OnInit, signal, PLATFORM_ID  } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService } from '../../services/book-service';
import { BookCard } from '../book-card/book-card';

@Component({
  selector: 'app-books',
  imports: [RouterLink, BookCard],
  templateUrl: './books.html',
  styleUrl: './books.css',
})
export class Books implements OnInit{
  private bookService = inject(BookService);
  private platformId = inject(PLATFORM_ID);

  books = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadBooks();
    }
  }

  loadBooks(): void {
    this.isLoading.set(true);
    this.bookService.getMyBooks().subscribe({
      next: (data) => {
        this.books.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar libros:', err);
        this.isLoading.set(false);
      }
    });
  }

  openBookDetails(bookId: number): void {
    console.log('Libro seleccionado:', bookId);
  }
}
