import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  constructor(private messageService: MessageService) {}

  errorHandler(err: HttpErrorResponse) {
    console.log(err);

    let message = 'Error';

    if (err.status === 0) {
      message = 'API is not available';
    } else if (err.status === 404) {
      message = 'API not found';
    } else if (err.status === 401) {
      message = 'You are not allowed for this process';
    } else if (err.status === 500) {
      message = '';

      for (const e of err.error.errorMessages) {
        message += e + '\n';
      }
    }

    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 3000
    });
  }
}
