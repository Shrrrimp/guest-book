import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';


@Injectable()

export class AuthService {
  public user: User;
  public token: string;
  public baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public logIn(email: string, password: string): Observable<User> {
    return this.http.post<User>(this.baseUrl + 'api/v1/auth/login', {email, password})
      .pipe(map(data => {
        if (data) {
          this.user = data;
          this.token = data.token.access_token;
          localStorage.setItem('token', this.token);
        }
        return data;
      }));
  }

}
