import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, shareReplay } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface LoginResponse {
  idToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})

export class Auth {
  private http = inject(HttpClient);
private platformId = inject(PLATFORM_ID);
  private apiUrl = 'http://localhost:8000/user';

  // Signal reactivo para que el Navbar o cualquier componente sepa si hay sesión
  isAuthenticated = signal<boolean>(this.hasValidToken());

  register(data: RegisterRequest): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/`, data);
  }

  login(identifier: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { identifier, password }).pipe(
      tap((res) => this.setSession(res)),
      shareReplay(1)
    );
  }

private setSession(authResult: LoginResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      const expiresAt = Date.now() + authResult.expiresIn * 1000;
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('expires_at', JSON.stringify(expiresAt));
    }
    this.isAuthenticated.set(true);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('id_token');
      localStorage.removeItem('expires_at');
    }
    this.isAuthenticated.set(false);
  }
private hasValidToken(): boolean {
    // 2. Si está ejecutándose en el servidor SSR, devuelve false sin tocar localStorage
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const expiration = localStorage.getItem('expires_at');
    if (!expiration) return false;
    return Date.now() < JSON.parse(expiration);
  }
}
