import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service/auth.service';
import { RoleEnum } from '../interfaces/role-enum';

export const fattorinoGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getStoredUserRole() == RoleEnum.FATTORINO) {
    return true;
  } else {
    return router.createUrlTree(['/user/profile/login']);
  }

};