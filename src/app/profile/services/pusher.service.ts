import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PusherService {
  public echo: Echo;
  private publicSubject: BehaviorSubject<object>;
  public publicPush: Observable<any>;
  private privateSubject: BehaviorSubject<object>;
  public privatePush: Observable<any>;

  constructor(private http: HttpClient, private authService: AuthService) {
    const currentUser = this.authService.currentUserValue;
    this.publicSubject = new BehaviorSubject<any>(null);
    this.publicPush = this.publicSubject.asObservable();
    this.privateSubject = new BehaviorSubject<any>(null);
    this.privatePush = this.privateSubject.asObservable();

    Pusher.logToConsole = false;

    this.echo = new Echo({
      broadcaster: 'pusher',
      key: 'key',
      wsHost: 'guest-book.naveksoft.com',
      wsPort: '443',
      wssPort: '443',
      wsPath: '/ws',
      encrypted: true,
      authEndpoint: 'https://guest-book.naveksoft.com/broadcasting/auth',
      auth: {
        headers: {
          Authorization: `Bearer ${currentUser.token.access_token}`,
          Accept: `application/json`
        },
      },
      enabledTransports: ['ws', 'wss'], // https://github.com/beyondcode/laravelwebsockets/issues/86
      disableStats: true,
    });

    this.echo.channel('posts').listen('PublicPush', e => {
      if (e.data.type === 'post_deleted') {
        this.publicSubject.next(e.data);
      }

      if (e.data.data.user_id !== currentUser.user.id) {
        this.publicSubject.next(e.data);
      }
    });

    this.echo.private('user.' + currentUser.user.id.toString()).listen('UserPush', e => {
      console.log('USER EVENT!!!');
      console.log(e, 'userrr evvvent!');
      if (e.data.type === 'answer_added' && e.data.data.user.is_admin) {
        this.privateSubject.next(e.data);
      }
    });
  }

}
