import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router, NavigationExtras } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router : Router, private toastr: ToastrService) {}
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error) {
          switch (error.status) {
            case 400:
              this.toastr.error("400 Bad Request error occurred");
              /* if (error.error.errors) {
                const modalStateErrors: string[] = [];
                for (const key in error.error.errors) {
                  if (error.error.errors[key]) {
                    modalStateErrors.push(error.error.errors[key] as string);
                   // this.toastr.error(error.error.errors[key] as string);
                  }
                }
                throw ([] as string[]).concat(...modalStateErrors);
              } else if (typeof(error.error) === 'object') {
                this.toastr.error(error.statusText, error.status);
              } else {
                this.toastr.error(error.error, error.status);
              } */
              break;
            case 401:
              this.toastr.error(error.error);
              break;
            case 404:
              this.toastr.error('Not found exception occurred');
             // this.router.navigateByUrl('/not-found');
              break;
            case 500:
              this.toastr.error('Internal server error');
             // const navigationExtras: NavigationExtras = {state: {error: error.error}}
            //  this.router.navigateByUrl('/server-error', navigationExtras);
              break;
            default:
              this.toastr.error('Something unexpected went wrong');
              console.log(error);
              break;
          }
        }
        return throwError(error);
      })
    )
  }
}