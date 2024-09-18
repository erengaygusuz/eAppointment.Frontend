import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResultModel } from '../models/others/result.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) {}

  post<T>(
    apiUrl: string,
    body: any,
    callback: (res: ResultModel<T>) => void,
    errCallback?: (err: HttpErrorResponse) => void
  ) {
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
          if (errCallback !== undefined) {
            errCallback(err);
          }
        }
      });
  }
}
