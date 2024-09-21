import { inject } from '@angular/core';

import {
  HttpRequest,
  HttpResponse,
  HttpInterceptorFn,
  HttpHandlerFn
} from '@angular/common/http';

import { map } from 'rxjs';
import { EncryptionDecryptionService } from '../services/encryption.decryption.service';

export const EncryptionDecryptionInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const encryptionDecryptionService = inject(EncryptionDecryptionService);

  const includedRequestURLList = [
    '/api/users/getall',
    '/api/roles/getmenuitems'
  ];

  const includedResponseURLList = [
    '/api/users/getall',
    '/api/roles/getmenuitems'
  ];

  const includedRequestFound = includedRequestURLList.filter(element => {
    return req.url.includes(element);
  });

  const includedResponseFound = includedResponseURLList.filter(element => {
    return req.url.includes(element);
  });

  if (includedRequestFound && includedRequestFound.length > 0) {
    if (req.method == 'POST') {
      if (req.body || req.body.length > 0) {
        const cloneReq = req.clone({
          body: encryptionDecryptionService.encryptUsingAES256(
            JSON.stringify(req.body)
          ),

          setHeaders: {
            'Content-Type': 'application/json;text/plain',
            Accept: 'application/json;text/plain'
          }
        });

        if (includedResponseFound && includedResponseFound.length > 0) {
          return next(cloneReq).pipe(
            map((event: any) => {
              if (event instanceof HttpResponse) {
                const decryptedBody =
                  encryptionDecryptionService.decryptUsingAES256(
                    event.body.data
                  );

                const modifiedResponse = event.clone({
                  body: JSON.parse(decryptedBody)
                });

                return modifiedResponse;
              }

              return event;
            })
          );
        }

        return next(cloneReq);
      }

      return next(req);
    } else if (req.method == 'GET') {
      if (req.url.indexOf('?') > 0) {
        const encriptURL =
          req.url.substr(0, req.url.indexOf('?') + 1) +
          encryptionDecryptionService.encryptUsingAES256(
            req.url.substr(req.url.indexOf('?') + 1, req.url.length)
          );

        const cloneReq = req.clone({
          url: encriptURL,
          setHeaders: {
            'Content-Type': 'application/json;text/plain',
            Accept: 'application/json;text/plain'
          }
        });

        return next(cloneReq);
      }

      return next(req);
    }
  }

  if (includedResponseFound && includedResponseFound.length > 0) {
    return next(req).pipe(
      map((event: any) => {
        if (event instanceof HttpResponse) {
          const decryptedBody = encryptionDecryptionService.decryptUsingAES256(
            event.body.data
          );

          const modifiedResponse = event.clone({
            body: JSON.parse(decryptedBody)
          });

          return modifiedResponse;
        }

        return event;
      })
    );
  }

  return next(req);
};
