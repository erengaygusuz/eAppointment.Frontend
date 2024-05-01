import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResultModel } from '../models/result.model';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  post<T>(apiUrl: string, body:any, callback: (res: ResultModel<T>) => void, errCallback: (err: HttpErrorResponse) => void){
    this.http.post<ResultModel<T>>(`${apiUrl}`, body).subscribe({
      next: (res => {
        callback(res);
      }),
      error: ((err: HttpErrorResponse) => {
        if(errCallback !== undefined){
          errCallback(err);
        }
      })
    })
  }
}
