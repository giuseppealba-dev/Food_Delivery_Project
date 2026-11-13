import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service/auth.service';

export const profileRedirectGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isLoggedIn()) {
    // Se l'utente è loggato, vai alla dashboard
    return router.createUrlTree(['/user/profile/dashboard']);
  } else {
    // Se l'utente non è loggato, vai al login
    return router.createUrlTree(['/user/profile/login']);
  }
};
