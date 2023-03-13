import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, Observable, of, throwError} from "rxjs";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor{

  constructor(private router:Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(error => {
      let errorMessage = "Couldn't Contact Server";
      if(error.headers.get("error-message")!=null) {
        errorMessage = error.headers.get("error-message");
      }
      alert(errorMessage);
      this.router.navigateByUrl("");
      throw new Error(errorMessage);
    }))
  }
}
