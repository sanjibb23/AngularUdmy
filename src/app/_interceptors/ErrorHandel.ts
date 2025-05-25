// error.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorHandel implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        const modalStateErrors: string[] = [];
        if (error.error instanceof ErrorEvent) {
          // Client-side errors
          errorMessage = `Client Error: ${error.error.message}`;
        } else {
          // Server-side errors
          errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        modalStateErrors.push(errorMessage as string);
        // Optional: You can show error notifications here
       // console.error(errorMessage);

        // Forward the error to the component if needed
        throw ([] as string[]).concat(...modalStateErrors);
      })
    );
  }
}
