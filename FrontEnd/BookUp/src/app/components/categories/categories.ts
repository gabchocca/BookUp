import { Component, inject, OnInit, signal, PLATFORM_ID, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { form, required, maxLength, FormField } from '@angular/forms/signals';
import { Category, CategoryCreate, BookInCategory } from '../../interfaces/category';
import { BookCard } from '../book-card/book-card';
import { CategoryService } from '../../services/category-service';
import { BookService } from '../../services/book-service';

@Component({
  selector: 'app-categories',
  imports: [FormField, BookCard],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})

export class Categories implements OnInit {
  categoryService = inject(CategoryService);
  private bookService = inject(BookService);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  // Modelo y Signal Form de creación
  private categoryModel = signal<CategoryCreate>({
    name: ''
  });

  categoryForm = form(this.categoryModel, (schema) => {
    required(schema.name, { message: 'El nombre de la categoría es obligatorio' });
    maxLength(schema.name, 100, { message: 'Máximo 100 caracteres' });
  });

  // Estado principal
  selectedCategory = signal<Category | null>(null);
  categoryBooks = signal<BookInCategory[]>([]);

  // Modo selección para quitar libros (igual que en Books)
  selectionMode = signal<boolean>(false);
  selectedBookIds = signal<number[]>([]);
  showRemoveBooksModal = signal<boolean>(false);
  isRemovingBooks = signal<boolean>(false);

  // Estados de carga y error
  isLoadingCategories = signal<boolean>(true);
  isLoadingBooks = signal<boolean>(false);
  isCreating = signal<boolean>(false);
  errorMessage = signal<string>('');
  showErrorModal = signal<boolean>(false);

  // Estado del modal de eliminar categoría
  showDeleteModal = signal<boolean>(false);
  categoryToDelete = signal<Category | null>(null);
  isDeleting = signal<boolean>(false);

  // Estado del modal para añadir libros a la categoría
  showAddBooksModal = signal<boolean>(false);
  allMyBooks = signal<any[]>([]);
  isLoadingAllBooks = signal<boolean>(false);
  searchBookQuery = signal<string>('');
  togglingBookIds = signal<number[]>([]);

  filteredMyBooks = computed(() => {
    const query = this.searchBookQuery().toLowerCase().trim();
    const books = this.allMyBooks();
    if (!query) return books;
    return books.filter(
      (b) =>
        (b.title && b.title.toLowerCase().includes(query)) ||
        (b.author && b.author.toLowerCase().includes(query))
    );
  });

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCategories();
    }
  }

  loadCategories(): void {
    this.isLoadingCategories.set(true);
    this.categoryService.getMyCategories().subscribe({
      next: (cats) => {
        this.isLoadingCategories.set(false);
        if (cats.length > 0 && !this.selectedCategory()) {
          this.selectCategory(cats[0]);
        }
      },
      error: (err) => {
        this.isLoadingCategories.set(false);
        this.openErrorModal(err.error?.detail || 'Error al cargar las categorías');
      },
    });
  }

  onCreateCategory(event: Event): void {
    event.preventDefault();
    if (this.categoryForm().invalid()) return;

    const name = this.categoryModel().name.trim();
    if (!name) return;

    this.isCreating.set(true);
    this.errorMessage.set('');

    this.categoryService.createCategory({ name }).subscribe({
      next: (created) => {
        this.categoryModel.set({ name: '' });
        this.categoryForm().reset();
        this.isCreating.set(false);
        this.selectCategory(created);
      },
      error: (err) => {
        this.isCreating.set(false);
        this.openErrorModal(err.error?.detail || 'No se pudo crear la categoría');
      },
    });
  }

  selectCategory(category: Category): void {
    this.selectedCategory.set(category);
    this.selectionMode.set(false);
    this.selectedBookIds.set([]);
    this.isLoadingBooks.set(true);

    this.categoryService.getBooksByCategory(category.id).subscribe({
      next: (books) => {
        this.categoryBooks.set(books);
        this.isLoadingBooks.set(false);
      },
      error: (err) => {
        this.isLoadingBooks.set(false);
        this.openErrorModal(err.error?.detail || 'Error al obtener los libros de la categoría');
      },
    });
  }

  openBookDetails(bookId: number): void {
    this.router.navigate(['/myBooks/book', bookId]);
  }

  // --- MODO SELECCIÓN PARA QUITAR LIBROS ---
  toggleSelectionMode(): void {
    this.selectionMode.update((val) => !val);
    this.selectedBookIds.set([]);
  }

  toggleBookSelection(bookId: number): void {
    this.selectedBookIds.update((ids) =>
      ids.includes(bookId) ? ids.filter((id) => id !== bookId) : [...ids, bookId]
    );
  }

  openRemoveBooksModal(): void {
    if (this.selectedBookIds().length > 0) {
      this.showRemoveBooksModal.set(true);
    }
  }

  closeRemoveBooksModal(): void {
    this.showRemoveBooksModal.set(false);
  }

  executeBulkRemoveBooks(): void {
    const currentCat = this.selectedCategory();
    const idsToRemove = this.selectedBookIds();
    if (!currentCat || idsToRemove.length === 0) return;

    this.isRemovingBooks.set(true);
    const requests = idsToRemove.map((bookId) =>
      this.categoryService.removeBookFromCategory(currentCat.id, bookId)
    );

    forkJoin(requests).subscribe({
      next: () => {
        this.categoryBooks.update((list) => list.filter((b) => !idsToRemove.includes(b.id)));
        this.isRemovingBooks.set(false);
        this.showRemoveBooksModal.set(false);
        this.selectionMode.set(false);
        this.selectedBookIds.set([]);
      },
      error: (err) => {
        this.isRemovingBooks.set(false);
        this.showRemoveBooksModal.set(false);
        this.openErrorModal(err.error?.detail || 'Error al quitar los libros de la categoría');
      },
    });
  }

  // --- MODAL AÑADIR LIBROS A CATEGORÍA ---
  openAddBooksModal(): void {
    if (!this.selectedCategory()) return;
    this.searchBookQuery.set('');
    this.showAddBooksModal.set(true);
    this.isLoadingAllBooks.set(true);

    this.bookService.getMyBooks().subscribe({
      next: (books) => {
        this.allMyBooks.set(books);
        this.isLoadingAllBooks.set(false);
      },
      error: (err) => {
        this.isLoadingAllBooks.set(false);
        this.closeAddBooksModal();
        this.openErrorModal(err.error?.detail || 'Error al cargar tu biblioteca');
      },
    });
  }

  closeAddBooksModal(): void {
    this.showAddBooksModal.set(false);
  }

  isBookInCurrentCategory(bookId: number): boolean {
    return this.categoryBooks().some((b) => b.id === bookId);
  }

  isBookToggling(bookId: number): boolean {
    return this.togglingBookIds().includes(bookId);
  }

  toggleBookInCategory(book: any): void {
    const currentCat = this.selectedCategory();
    if (!currentCat || this.isBookToggling(book.id)) return;

    this.togglingBookIds.update((ids) => [...ids, book.id]);
    const alreadyAdded = this.isBookInCurrentCategory(book.id);

    if (alreadyAdded) {
      this.categoryService.removeBookFromCategory(currentCat.id, book.id).subscribe({
        next: () => {
          this.categoryBooks.update((list) => list.filter((b) => b.id !== book.id));
          this.togglingBookIds.update((ids) => ids.filter((id) => id !== book.id));
        },
        error: (err) => {
          this.togglingBookIds.update((ids) => ids.filter((id) => id !== book.id));
          this.openErrorModal(err.error?.detail || 'No se pudo quitar el libro');
        },
      });
    } else {
      this.categoryService.addBookToCategory(currentCat.id, book.id).subscribe({
        next: () => {
          this.categoryBooks.update((list) => [...list, book]);
          this.togglingBookIds.update((ids) => ids.filter((id) => id !== book.id));
        },
        error: (err) => {
          this.togglingBookIds.update((ids) => ids.filter((id) => id !== book.id));
          this.openErrorModal(err.error?.detail || 'No se pudo añadir el libro');
        },
      });
    }
  }

  // --- VALIDACIÓN Y MODALES DE ERROR / ELIMINAR CATEGORÍA ---
  getErrorMessage(field: any): string | null {
    const state = field();
    if (state.dirty() && state.invalid()) {
      const errors = state.errors();
      return Array.isArray(errors) ? errors[0]?.message : errors?.message;
    }
    return null;
  }

  openErrorModal(message: string): void {
    this.errorMessage.set(message);
    this.showErrorModal.set(true);
  }

  cerrarErrorModal(): void {
    this.showErrorModal.set(false);
    this.errorMessage.set('');
  }

  openDeleteModal(event: Event, category: Category): void {
    event.stopPropagation();
    this.categoryToDelete.set(category);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.categoryToDelete.set(null);
  }

  executeDeleteCategory(): void {
    const target = this.categoryToDelete();
    if (!target) return;

    this.isDeleting.set(true);
    this.categoryService.deleteCategory(target.id).subscribe({
      next: () => {
        if (this.selectedCategory()?.id === target.id) {
          this.selectedCategory.set(null);
          this.categoryBooks.set([]);
        }
        this.isDeleting.set(false);
        this.closeDeleteModal();
      },
      error: (err) => {
        this.isDeleting.set(false);
        this.closeDeleteModal();
        this.openErrorModal(err.error?.detail || 'Error al eliminar la categoría');
      },
    });
  }
}
