import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private router: Router) {}

  handleError(error: HttpErrorResponse): void {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('Client-side error:', error.error.message);
    } else {
      // Server-side error
      console.error(`Server-side error: ${error.status} - ${error.message}`);

      // Handle specific status codes
      switch (error.status) {
        case 400:
          this.handleBadRequest(error);
          break;
        case 401:
          this.handleUnauthorized(error);
          break;
        case 403:
          this.handleForbidden(error);
          break;
        case 404:
          this.handleNotFound(error);
          break;
        case 500:
          this.handleServerError(error);
          break;
        default:
          this.handleUnknownError(error);
      }
    }
  }

  private handleBadRequest(error: HttpErrorResponse): void {
    // Handle 400 Bad Request
    console.error('Bad Request:', error.error);
    alert('Bad Request: Please check your input.');
  }

  private handleUnauthorized(error: HttpErrorResponse): void {
    // Handle 401 Unauthorized
    console.error('Unauthorized:', error.error);
    alert('Unauthorized: Please login to continue.');
    this.router.navigate(['/login']);
  }

  private handleForbidden(error: HttpErrorResponse): void {
    // Handle 403 Forbidden
    console.error('Forbidden:', error.error);
    alert('Forbidden: You do not have permission to access this resource.');
    this.router.navigate(['/forbidden']);
  }

  private handleNotFound(error: HttpErrorResponse): void {
    // Handle 404 Not Found
    console.error('Not Found:', error.error);
    alert('Not Found: The requested resource was not found.');
    this.router.navigate(['/not-found']);
  }

  private handleServerError(error: HttpErrorResponse): void {
    // Handle 500 Internal Server Error
    console.error('Server Error:', error.error);
    alert('Server Error: An unexpected error occurred.');
  }

  private handleUnknownError(error: HttpErrorResponse): void {
    // Handle other types of errors
    console.error('An unknown error occurred:', error.error);
    alert('An unexpected error occurred. Please try again later.');
  }
}
