import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const AdminAuthGuard: CanActivateFn = (route, state) => {

  const auth = inject(AuthService);

  const router = inject(Router);

  if(auth.tokenDecode.roles.includes("Admin")){
    return true;
  }
  else{
    router.navigateByUrl("/unauthorized");
    return false;
  }
};
