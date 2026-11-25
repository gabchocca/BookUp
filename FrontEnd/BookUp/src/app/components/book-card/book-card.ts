import { Component, computed, input, output, inject, signal } from '@angular/core';
import { BookService } from '../../services/book-service';

@Component({
  selector: 'app-book-card',
  imports: [],
  templateUrl: './book-card.html',
  styleUrl: './book-card.css',
})
export class BookCard {
  private bookService = inject(BookService);

  book = input.required<any>();
  selectionMode = input<boolean>(false);
  isSelected = input<boolean>(false);

  selectBook = output<number>();
  toggleSelect = output<number>();

  imageError = signal<boolean>(false);
  coverUrl = computed(() => this.bookService.getCoverUrl(this.book().id));

  onCardClick(): void {
    if (this.selectionMode()) {
      this.toggleSelect.emit(this.book().id);
    } else {
      this.selectBook.emit(this.book().id);
    }
  }

  onImageError(): void {
    this.imageError.set(true);
  }
}
