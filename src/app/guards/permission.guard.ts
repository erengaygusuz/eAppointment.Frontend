import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const PermissionGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.isTokenExpired()) {
    tokenService.clearTokens();

    router.navigate(['/login']);

    return false;
  }

  const requiredPermissions = route.data['Permissions'] as Array<string>;

  const userPermissions = tokenService.getUserPermissions();

  const hasPermission = requiredPermissions.every(permission =>
    userPermissions.includes(permission)
  );

  if (!hasPermission) {
    router.navigate(['/unauthorized']);

    return false;
  }

  return true;
};
