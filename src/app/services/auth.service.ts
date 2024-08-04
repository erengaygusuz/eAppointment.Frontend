import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token.service';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private refreshTokenUrl = 'https://your-api.com/auth/refresh-token';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  refreshToken(): Observable<boolean> {
    const refreshToken = this.tokenService.getRefreshToken();

    if (!refreshToken) {
      return of(false);
    }

    return this.http
      .post<{ accessToken: string }>(this.refreshTokenUrl, { refreshToken })
      .pipe(
        switchMap(response => {
          this.tokenService.saveToken(response.accessToken);
          return of(true);
        }),
        catchError(() => of(false))
      );
  }

  isTokenExpiring(): boolean {
    const expiryDate = this.tokenService.getTokenExpiryDate();

    if (!expiryDate) {
      return false;
    }

    const currentDate = new Date();
    // Check if the token is going to expire in the next 5 minutes
    return currentDate.getTime() > expiryDate.getTime() - 5 * 60 * 1000;
  }
}
