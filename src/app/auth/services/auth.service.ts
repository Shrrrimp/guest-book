import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
          console.log('ma user:');
          console.log(this.user);
          localStorage.setItem('token', this.token);
          localStorage.setItem('userName', this.user.user.name);
        }
        return data;
      }));
  }

  // TODO: пересмотреть метод
  public getCurrentUserPic(): Observable<any> {
    console.log('user:');
    console.log(this.user);

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.token}` });
    const options = { headers: headers };
    return this.http.get(this.user.user.avatar, options).pipe(map(data => {
      console.log('data');
      console.log(data);
    }));
  }

  // TODO: пересмотреть метод
  public getCurrentUserName(): string {
    return localStorage.userName;
  }

}
