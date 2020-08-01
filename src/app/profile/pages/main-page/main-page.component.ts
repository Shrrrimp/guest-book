import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommentsService } from '../../services/comments.service';
import { AuthService } from '../../../auth/services/auth.service';
import { PusherService } from '../../services/pusher.service';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {
  public addCommentForm: FormGroup;
  public currentUser: User;
  private currentUserSubscription: Subscription;

  public paginationConfig = {
    itemsPerPage: 0,
    currentPage: 0,
    totalItems: 0
  };

  constructor(
    public commentsService: CommentsService,
    private authService: AuthService,
    private pusherService: PusherService,
    public utilsService: UtilsService
    ) {
      this.currentUserSubscription = this.authService.currentUser.subscribe(user => {
        this.currentUser = user.user;
      });
    }

  ngOnInit(): void {
    this.pusherService.echo.channel('posts').listen('PublicPush', e => {
      console.log('EVENT!!!');
      console.log(e, 'evvvent!');
    });

    this.pusherService.echo.private('user.' + this.currentUser.id.toString()).listen('UserPush', e => {
      console.log('USER EVENT!!!');
      console.log(e, 'userrr evvvent!');
    });

    this.addCommentForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      message: new FormControl('', [Validators.required, Validators.maxLength(65535)])
    });

    this.commentsService.getCommentsList().subscribe((data) => {
      this.commentsService.commentsList = data;

      console.log('comments:');
      console.log(this.commentsService.commentsList);

      this.paginationConfig.currentPage = this.commentsService.commentsList.meta.current_page;
      this.paginationConfig.itemsPerPage = this.commentsService.commentsList.meta.per_page;
      this.paginationConfig.totalItems = this.commentsService.commentsList.meta.total;

    }, err => console.error(err));
  }

  get title() { return this.addCommentForm.get('title'); }

  get message() { return this.addCommentForm.get('message'); }

  addComment() {
    if (this.addCommentForm.valid) {
      this.commentsService.addComment(this.title.value, this.message.value).subscribe(data => {
        if (this.paginationConfig.currentPage === 1) {
          this.commentsService.commentsList.data.unshift(data);
        }
        this.addCommentForm.reset();
      }, err => console.error(err));
    }
  }

  onPageChange($event) {
    this.paginationConfig.currentPage = $event;

    this.commentsService.getNextCommentsPage($event).subscribe((data) => {
      this.commentsService.commentsList = data;
      this.paginationConfig.totalItems = this.commentsService.commentsList.meta.total;
    });
  }

  ngOnDestroy() {
    this.currentUserSubscription.unsubscribe();
  }

}
