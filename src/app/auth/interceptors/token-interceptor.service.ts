import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req, next) {
    const tokenizedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${localStorage.token}`
      }
    });

    return next.handle(tokenizedReq);
  }
}
