import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req, next) {
    const currentUser = this.authService.currentUserValue;
    const tokenizedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${currentUser.token.access_token}`
      }
    });

    return next.handle(tokenizedReq);
  }
}
