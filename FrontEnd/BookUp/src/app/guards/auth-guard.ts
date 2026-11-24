import { CanActivateFn, Router } from '@angular/router';
import { inject} from '@angular/core';
import { Auth } from '../services/auth';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(Auth);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (authService.hasValidToken()) {
    return true;
  }

  //Pop Up de SweetAlert
  if (isPlatformBrowser(platformId)) {
    await Swal.fire({
      icon: 'warning',
      title: 'Acceso restringido',
      text: 'Tienes que iniciar sesión primero para entrar aquí.',
      confirmButtonText: 'Ir al login',
      allowOutsideClick: false,
    });
  }

  //redirect to login
  return router.createUrlTree(['/login-register/login']);
};
