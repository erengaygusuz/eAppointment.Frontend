import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const AdminAuthGuard: CanActivateFn = () => {
  const auth = inject(AuthService);

  // const router = inject(Router);

  // const roles = auth.tokenDecode.role;

  return false;

  // if (roles.filter((x: any) => x.name == 'Admin')) {
  //   return true;
  // } else {
  //   router.navigateByUrl('/unauthorized');
  //   return false;
  // }
};
