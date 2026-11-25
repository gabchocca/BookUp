import { Component, computed,input, output, inject, signal} from '@angular/core';
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
  selectBook = output<number>();

  imageError = signal<boolean>(false);
  coverUrl = computed(() => this.bookService.getCoverUrl(this.book().id));

  onCardClick(): void {
    this.selectBook.emit(this.book().id);
  }

  onImageError(): void {
    this.imageError.set(true);
  }
}
