import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { TokenModel } from '../models/others/token.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  tokenDecode: TokenModel = new TokenModel();

  constructor(private router: Router) {}

  isAuthenticated() {
    const token: string | null = localStorage.getItem('token');

    if (token) {
      const decode: JwtPayload | any = jwtDecode(token);
      const expireDate = decode.exp;
      const currentDate = new Date().getTime() / 1000;

      if (currentDate > expireDate) {
        localStorage.removeItem('token');
        this.router.navigateByUrl('/login');

        return false;
      }

      this.tokenDecode.id =
        decode[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ];
      this.tokenDecode.name =
        decode['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
      this.tokenDecode.email =
        decode[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
        ];
      this.tokenDecode.userName = decode['UserName'];
      this.tokenDecode.patientId = decode['PatientId'];
      this.tokenDecode.roles = JSON.parse(
        decode['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      );

      return true;
    }

    this.router.navigateByUrl('/login');

    return false;
  }
}
