import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/profile/models/user.model';
import { Subscription } from 'rxjs';
import { UtilsService } from '../services/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public currentUser: User;
  private currentUserSubscription: Subscription;

  constructor(private router: Router, private authService: AuthService, public utilsService: UtilsService) {
    this.currentUserSubscription = this.authService.currentUser.subscribe(user => {
      user ?  this.currentUser = user.user : this.currentUser = null;
    });
   }

  ngOnInit(): void {
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy() {
    this.currentUserSubscription.unsubscribe();
  }

}
