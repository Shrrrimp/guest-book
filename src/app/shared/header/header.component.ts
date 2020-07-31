import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/profile/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public currentUser: User;
  private currentUserSubscription: Subscription;
  public currentUserPic;

  constructor(private authService: AuthService) {
    this.currentUserSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user.user;
    });
   }

  ngOnInit(): void {
    // this.authService.getCurrentUserPic().subscribe(data => {
    //   this.currentUserPic = data;
    // }, err => console.error(err));
  }

  ngOnDestroy() {
    this.currentUserSubscription.unsubscribe();
  }

}
