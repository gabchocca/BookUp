import { Component, OnInit, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { form, required, FormField } from '@angular/forms/signals';
import { BookService } from '../../services/book-service';
import { BookEdit } from '../../interfaces/book';

@Component({
  selector: 'app-book-detail',
  imports: [RouterLink, FormField, DatePipe],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.css',
})
export class BookDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private bookService = inject(BookService);
  private platformId = inject(PLATFORM_ID);

  book = signal<any | null>(null);
  coverUrl = signal<string>('');
  imageError = signal<boolean>(false);

  isLoading = signal<boolean>(true);
  isEditing = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  successMessage = signal<string>('');
  errorMessage = signal<string>('');

  private editModel = signal<BookEdit>({
    title: '',
    description: '',
    review: ''
  });

  editForm = form(this.editModel, (schema) => {
    required(schema.title, { message: 'El título es obligatorio' });
  });

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      if (id) {
        this.coverUrl.set(this.bookService.getCoverUrl(id));
        this.loadBook(id);
      }
    }
  }

  loadBook(id: number): void {
    this.isLoading.set(true);
    this.bookService.getBookById(id).subscribe({
      next: (data) => {
        this.book.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.detail || 'No se pudo cargar el libro');
        this.isLoading.set(false);
      }
    });
  }

  startEditing(): void {
    const current = this.book();
    if (!current) return;

    this.editModel.set({
      title: current.title || '',
      description: current.description || '',
      review: current.review || ''
    });
    this.successMessage.set('');
    this.errorMessage.set('');
    this.isEditing.set(true);
  }

  cancelEditing(): void {
    this.isEditing.set(false);
    this.errorMessage.set('');
  }

  saveChanges(event: Event): void {
    event.preventDefault();
    if (this.editForm().invalid()) return;

    const current = this.book();
    if (!current) return;

    this.isSaving.set(true);
    this.errorMessage.set('');

    this.bookService.updateBook(current.id, this.editModel()).subscribe({
      next: (updated) => {
        this.book.update(b => ({ ...b, ...updated }));
        this.isSaving.set(false);
        this.isEditing.set(false);
        this.successMessage.set('Cambios guardados correctamente');
      },
      error: (err) => {
        this.isSaving.set(false);
        this.errorMessage.set(err.error?.detail || 'Error al guardar los cambios');
      }
    });
  }

  onImageError(): void {
    this.imageError.set(true);
  }
}
