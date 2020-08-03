import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/profile/models/user.model';
import { Subscription } from 'rxjs';
import { UtilsService } from '../services/utils.service';
import { PusherService } from 'src/app/profile/services/pusher.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public currentUser: User;
  private currentUserSubscription: Subscription;

  constructor(private authService: AuthService, public utilsService: UtilsService, private pusherService: PusherService) {
    this.currentUserSubscription = this.authService.currentUser.subscribe(user => {
      user ?  this.currentUser = user.user : this.currentUser = null;
    });
   }

  ngOnInit(): void {
  }

  logOut() {
    this.authService.logOut();
  }

  ngOnDestroy() {
    this.currentUserSubscription.unsubscribe();
  }

}
