import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResultModel } from '../models/others/result.model';
import { environment } from '../../environments/environment';
import { MessageService } from 'primeng/api';
import { LanguageService } from './language.service';
import { Subject, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  toastErrorSummary: string = '';

  generalErrorMessage: string = '';

  selectedLanguage: string = '';

  unsubscribe = new Subject<void>();

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    this.languageService
      .getLanguage()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.selectedLanguage = data;

        this.translate.use(this.selectedLanguage);

        this.getTranslationData('Components.Toast', 'Error.Message');
      });
  }

  getTranslationData(key1: string, key2: string) {
    this.translate.get(key1).subscribe(data => {
      this.toastErrorSummary = data.Error.Summary;
    });

    this.translate.get(key2).subscribe(data => {
      this.generalErrorMessage = data;
    });
  }

  post<T>(apiUrl: string, body: any, callback: (res: ResultModel<T>) => void) {
    this.http
      .post<ResultModel<T>>(`${environment.API_URL}/${apiUrl}`, body, {
        headers: {
          'Accept-Language': (localStorage.getItem('language') || '').toString()
        }
      })
      .subscribe({
        next: res => {
          callback(res);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status == 0) {
            this.messageService.add({
              severity: 'error',
              summary: this.toastErrorSummary,
              detail: this.generalErrorMessage,
              life: 3000
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: this.toastErrorSummary,
              detail:
                err.error.errorMessages === undefined ||
                err.error.errorMessages === null
                  ? ''
                  : err.error.errorMessages[0],
              life: 3000
            });
          }
        }
      });
  }

  put<T>(apiUrl: string, body: any, callback: (res: ResultModel<T>) => void) {
    this.http
      .put<ResultModel<T>>(`${environment.API_URL}/${apiUrl}`, body, {
        headers: {
          'Accept-Language': (localStorage.getItem('language') || '').toString()
        }
      })
      .subscribe({
        next: res => {
          callback(res);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status == 0) {
            this.messageService.add({
              severity: 'error',
              summary: this.toastErrorSummary,
              detail: this.generalErrorMessage,
              life: 3000
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: this.toastErrorSummary,
              detail:
                err.error.errorMessages === undefined ||
                err.error.errorMessages === null
                  ? ''
                  : err.error.errorMessages[0],
              life: 3000
            });
          }
        }
      });
  }

  get<T>(apiUrl: string, callback: (res: ResultModel<T>) => void) {
    this.http
      .get<ResultModel<T>>(`${environment.API_URL}/${apiUrl}`, {
        headers: {
          'Accept-Language': (localStorage.getItem('language') || '').toString()
        }
      })
      .subscribe({
        next: res => {
          callback(res);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status == 0) {
            this.messageService.add({
              severity: 'error',
              summary: this.toastErrorSummary,
              detail: this.generalErrorMessage,
              life: 3000
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: this.toastErrorSummary,
              detail:
                err.error.errorMessages === undefined ||
                err.error.errorMessages === null
                  ? ''
                  : err.error.errorMessages[0],
              life: 3000
            });
          }
        }
      });
  }
}
