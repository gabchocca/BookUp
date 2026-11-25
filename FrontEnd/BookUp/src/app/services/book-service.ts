import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from '../../environments/environment';
import { BookRequest } from '../interfaces/book';
import { DirectoryResponse } from '../interfaces/directory-response';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/book`;

  getMyBooks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-books`);
  }

  uploadBook(book: BookRequest): Observable<any> {
    const { path, ...bodyData } = book;
    return this.http.post(`${this.apiUrl}/`, bodyData, {
      params: { path }
    });
  }

  getCoverUrl(bookId: number): string {
    return `${this.apiUrl}/${bookId}/cover`;
  }

  browseDirectory(folder?: string): Observable<DirectoryResponse> {
    const params: any = {};
    if (folder) {
      params.folder = folder;
    }
    return this.http.get<DirectoryResponse>(`${this.apiUrl}/browse`, { params });
  }

  deleteBooks(bookIds: number[]): Observable<any[]> {
    const requests = bookIds.map(id => this.http.delete(`${this.apiUrl}/${id}`));
    return forkJoin(requests);
  }

  getBookById(bookId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${bookId}`);
  }

  updateBook(bookId: number, data: { title?: string; author?: string; description?: string; review?: string }): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${bookId}`, data);
  }
}
