import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const idToken = localStorage.getItem('id_token');

    if (idToken) {
      return true; 
    }
  }

  // No tiene token -> Redirige automáticamente al login
  return router.createUrlTree(['/login-register/login']);
};
