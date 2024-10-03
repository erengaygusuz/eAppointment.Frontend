import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private tokenKey = 'auth_token';
  private refreshTokenKey = 'refresh_token';
  private jwtHelper = new JwtHelperService();

  saveToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  saveRefreshToken(token: string): void {
    sessionStorage.setItem(this.refreshTokenKey, token);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(this.refreshTokenKey);
  }

  clearTokens(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.refreshTokenKey);
  }

  getDecodedToken() {
    const token = this.getToken();

    return token ? this.jwtHelper.decodeToken(token) : null;
  }

  getUserPermissions(): string[] {
    const decodedToken = this.getDecodedToken();

    return decodedToken ? this.parseStringArray(decodedToken.Permissions) : [];
  }

  getUserId(): number {
    const decodedToken = this.getDecodedToken();
    const userId = decodedToken
      ? decodedToken[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ]
      : '0';

    return userId ? Number(userId) : 0;
  }

  getPatientId(): number {
    const decodedToken = this.getDecodedToken();

    return decodedToken ? Number(decodedToken.PatientId) : 0;
  }

  getDoctorId(): number {
    const decodedToken = this.getDecodedToken();

    return decodedToken ? Number(decodedToken.DoctorId) : 0;
  }

  getName(): string {
    const decodedToken = this.getDecodedToken();
    return decodedToken
      ? decodedToken[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
        ]
      : '';
  }

  getRole(): string {
    const decodedToken = this.getDecodedToken();
    return decodedToken
      ? JSON.parse(
          decodedToken[
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
          ]
        )
      : '';
  }

  isTokenExpired(): boolean {
    const token = this.getToken();

    return this.jwtHelper.isTokenExpired(token);
  }

  getTokenExpiryDate(): Date | null {
    const decodedToken = this.getDecodedToken();

    if (!decodedToken || !decodedToken.exp) {
      return null;
    }

    return new Date(decodedToken.exp * 1000);
  }

  private parseStringArray(input: string): string[] {
    const validJsonString = input.replace(/'/g, '"');

    try {
      return JSON.parse(validJsonString);
    } catch (error) {
      console.error('Error parsing string array:', error);

      return [];
    }
  }
}
