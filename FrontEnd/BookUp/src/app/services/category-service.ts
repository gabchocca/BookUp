import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Category,
  CategoryCreate,
  BookInCategory,
  MessageResponse,
} from '../interfaces/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/category`;

  // Signal reactivo para compartir el estado de las categorías en toda la app
  categories = signal<Category[]>([]);

  createCategory(data: CategoryCreate): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/`, data).pipe(
      tap((newCategory) => {
        this.categories.update((list) =>
          [...list, newCategory].sort((a, b) => a.name.localeCompare(b.name))
        );
      })
    );
  }

  getMyCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/my-categories`).pipe(
      tap((list) => this.categories.set(list))
    );
  }

  deleteCategory(categoryId: number): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${this.apiUrl}/${categoryId}`).pipe(
      tap(() => {
        this.categories.update((list) => list.filter((c) => c.id !== categoryId));
      })
    );
  }

  getBooksByCategory(categoryId: number): Observable<BookInCategory[]> {
    return this.http.get<BookInCategory[]>(`${this.apiUrl}/${categoryId}/books`);
  }

  addBookToCategory(categoryId: number, bookId: number): Observable<MessageResponse> {
    return this.http
      .post<MessageResponse>(`${this.apiUrl}/${categoryId}/books/${bookId}`, {})
      .pipe(
        tap(() => {
          this.categories.update((list) =>
            list.map((c) =>
              c.id === categoryId ? { ...c, book_count: c.book_count + 1 } : c
            )
          );
        })
      );
  }

  removeBookFromCategory(categoryId: number, bookId: number): Observable<MessageResponse> {
    return this.http
      .delete<MessageResponse>(`${this.apiUrl}/${categoryId}/books/${bookId}`)
      .pipe(
        tap(() => {
          this.categories.update((list) =>
            list.map((c) =>
              c.id === categoryId
                ? { ...c, book_count: Math.max(0, c.book_count - 1) }
                : c
            )
          );
        })
      );
  }
}
