import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpResponse,
  HttpEvent
} from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { tap } from 'rxjs';

export const SpinnerInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const spinner = inject(NgxSpinnerService);

  performance.now();
  spinner.show();

  return next(req).pipe(
    tap(
      async (event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          spinner.hide();
        }
      },
      (err: any) => {
        spinner.hide();
      }
    )
  );
};
