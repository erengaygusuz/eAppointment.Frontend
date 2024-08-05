import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn
} from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);

  if (authService.isTokenExpiring()) {
    return authService.refreshToken().pipe(
      switchMap(refreshed => {
        const token = tokenService.getToken();
        if (refreshed && token) {
          const cloned = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return next(cloned);
        }
        return next(req);
      })
    );
  }

  const token = tokenService.getToken();

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};
