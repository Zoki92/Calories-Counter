import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoadingScreenService } from './loading-screen.service';
import { finalize } from 'rxjs/operators';

@Injectable()
export class LoadingScreenInterceptor implements HttpInterceptor {

  activeRequests: number = 0;
  skipUrls = [
    '/api/token/refresh/',
  ]

  constructor(private loadingScreenService: LoadingScreenService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let displayLoadingScreen = true;
    for (const skipUrl of this.skipUrls) {
      if (new RegExp(skipUrl).test(request.url)) {
        displayLoadingScreen = false;
        break;
      }
    }

    if (displayLoadingScreen) {


      if (this.activeRequests === 0) {
        this.loadingScreenService.startLoading();
      }

      this.activeRequests++;


      return next.handle(request).pipe(
        finalize(() => {
          this.activeRequests--;
          if (this.activeRequests === 0) {
            this.loadingScreenService.stopLoading();
          }
        })
      );
    }
    else {
      return next.handle(request);
    }
  }
}
