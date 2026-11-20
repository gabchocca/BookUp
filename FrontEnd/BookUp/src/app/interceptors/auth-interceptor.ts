import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const idToken = localStorage.getItem('id_token');

    if (idToken) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${idToken}`)
      });
      return next(cloned);
    }
  }
  return next(req);
};
