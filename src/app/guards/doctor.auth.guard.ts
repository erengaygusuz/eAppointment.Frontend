import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const DoctorAuthGuard: CanActivateFn = (route, state) => {

  const auth = inject(AuthService);

  const router = inject(Router);

  const roles = auth.tokenDecode.roles;

  if(roles.filter(x => x.name == "Doctor")
    || roles.filter(x => x.name == "Admin")){
    return true;
  }
  else{
    router.navigateByUrl("/unauthorized");
    return false;
  }
};
