import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const PermissionGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.getToken() == null) {
    router.navigate(['/login']);

    return false;
  }

  if (tokenService.isTokenExpired()) {
    tokenService.clearTokens();

    router.navigate(['/login']);

    return false;
  }

  if (route.data !== null && route.data !== undefined) {
    const requiredPermissions = route.data['Permissions'] as Array<string>;

    if (requiredPermissions !== null && requiredPermissions !== undefined) {
      const userPermissions = tokenService.getUserPermissions();

      const hasPermission = requiredPermissions.every(permission =>
        userPermissions.includes(permission)
      );

      if (!hasPermission) {
        router.navigate(['/unauthorized']);

        return false;
      }
    }
  }

  return true;
};
