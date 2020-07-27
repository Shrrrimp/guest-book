import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';


@Injectable({
  providedIn: 'root'
})
export class PusherService {
  // pusher: Pusher;
  channel: any;
  echo: Echo;

  constructor(private http: HttpClient) {

    Pusher.logToConsole = true;

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
          Authorization: `Bearer ${localStorage.token}`,
          Accept: `application/json`
        },
      },
      enabledTransports: ['ws', 'wss'], // https://github.com/beyondcode/laravelwebsockets/issues/86
      disableStats: true,
    });
  }

}
