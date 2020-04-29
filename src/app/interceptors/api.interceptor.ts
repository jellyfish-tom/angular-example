import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { ErrorService } from "@services/error.service.ts";
import { environment } from "@environments/environment";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private errorService: ErrorService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const baseUrl = environment.baseUrl;
    const apiReq = req.clone({ url: `${baseUrl}${req.url}` });

    return next.handle(apiReq).pipe(
      catchError((error: Error) => {
        this.errorService.setErrorMessage(
          (error && error.message) ||
            "Oooops, something went wrong. Try again or contact your administrator."
        );

        return of(error);
      })
    );
  }
}
