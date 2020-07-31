import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';


@Injectable()

export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public baseUrl = environment.apiUrl;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

   public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public logIn(email: string, password: string): Observable<User> {
    return this.http.post<User>(this.baseUrl + 'api/v1/auth/login', {email, password})
      .pipe(map(data => {
        if (data) {
          console.log('ma user:');
          console.log(data);

          localStorage.setItem('currentUser', JSON.stringify(data));
          this.currentUserSubject.next(data);
        }
        return data;
    }));
  }

  public register(fd: FormData): Observable<User> {
    return this.http.post<User>(this.baseUrl + 'api/v1/auth/register', fd)
      .pipe(map(data => {
        if (data) {
          localStorage.setItem('currentUser', JSON.stringify(data));
          this.currentUserSubject.next(data);
        }
        return data;
    }));
  }

}
