import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, shareReplay } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { LoginResponse } from '../interfaces/login-response';
import { RegisterRequest } from '../interfaces/register-request';
import { environment } from '../../environments/environment';
import { User, UserUpdate } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})

export class Auth {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = `${environment.apiUrl}/user`;

  isAuthenticated = signal<boolean>(this.hasValidToken());

  register(data: RegisterRequest): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(identifier: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { identifier, password }).pipe(
      tap((res) => this.setSession(res)),
      shareReplay(1)
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('id_token');
      localStorage.removeItem('expires_at');
    }
    this.isAuthenticated.set(false);
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  updateProfile(data: UserUpdate): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/me`, data);
  }

  private setSession(authResult: LoginResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      const expiresAt = Date.now() + authResult.expiresIn * 1000;
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('expires_at', JSON.stringify(expiresAt));
    }
    this.isAuthenticated.set(true);
  }

  public hasValidToken(): boolean {
    //
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const expiration = localStorage.getItem('expires_at');
    if (!expiration) return false;
    return Date.now() < JSON.parse(expiration);
  }

}

