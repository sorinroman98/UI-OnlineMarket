import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authenticatonService: AuthenticationService) {}

  intercept(httpRequest: HttpRequest<any>, httpHandler: HttpHandler): Observable<HttpEvent<any>> {
    if(httpRequest.url.includes(`${this.authenticatonService.host}/user/login`)){
        return httpHandler.handle(httpRequest);
    }

    if(httpRequest.url.includes(`${this.authenticatonService.host}/user/register`)){
      return httpHandler.handle(httpRequest);
  }

    this.authenticatonService.loadToken();
    const token = this.authenticatonService.getToken();
    const request = httpRequest.clone({ setHeaders: { Authorization: `Bearer ${token}`}})

    return httpHandler.handle(request);
  }
}
