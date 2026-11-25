import { Component, inject, OnInit, signal, PLATFORM_ID  } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
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
  private router = inject(Router);


  books = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  // Estado del modo selección
  selectionMode = signal<boolean>(false);
  selectedIds = signal<number[]>([]);
  showDeleteModal = signal<boolean>(false);
  isDeleting = signal<boolean>(false);

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
    this.router.navigate(['/myBooks/book', bookId]);
  }

  toggleSelectionMode(): void {
    this.selectionMode.update(val => !val);
    this.selectedIds.set([]);
  }

  toggleBookSelection(bookId: number): void {
    this.selectedIds.update(ids =>
      ids.includes(bookId)
        ? ids.filter(id => id !== bookId)
        : [...ids, bookId]
    );
  }

  openDeleteModal(): void {
    if (this.selectedIds().length > 0) {
      this.showDeleteModal.set(true);
    }
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
  }

  executeBulkDelete(): void {
    const idsToDelete = this.selectedIds();
    if (idsToDelete.length === 0) return;

    this.isDeleting.set(true);
    this.bookService.deleteBooks(idsToDelete).subscribe({
      next: () => {
        // Filtra todos los libros borrados y sale del modo selección
        this.books.update(list => list.filter(b => !idsToDelete.includes(b.id)));
        this.isDeleting.set(false);
        this.showDeleteModal.set(false);
        this.selectionMode.set(false);
        this.selectedIds.set([]);
      },
      error: (err) => {
        console.error('Error al eliminar libros:', err);
        this.isDeleting.set(false);
        this.showDeleteModal.set(false);
      }
    });
  }
}
