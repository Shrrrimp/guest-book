import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PusherService {
  public echo: Echo;
  private publicSubject: BehaviorSubject<object>;
  public publicPush: Observable<any>;
  private privateSubject: BehaviorSubject<object>;
  public privatePush: Observable<any>;

  constructor(private authService: AuthService) {
    const currentUser = this.authService.currentUserValue;
    const config = environment.socket;
    this.publicSubject = new BehaviorSubject<any>(null);
    this.publicPush = this.publicSubject.asObservable();
    this.privateSubject = new BehaviorSubject<any>(null);
    this.privatePush = this.privateSubject.asObservable();

    Pusher.logToConsole = false;

    this.echo = new Echo({
      broadcaster: 'pusher',
      key: 'key',
      wsHost: config.url,
      wsPort: config.port,
      wssPort: config.port,
      wsPath: config.path,
      encrypted: config.encrypted,
      authEndpoint: config.auth.url,
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
      if (e.data.type === 'answer_added' && e.data.data.user.is_admin && e.data.data.user.id !== currentUser.user.id) {
        this.privateSubject.next(e.data);
      }
    });
  }

}
