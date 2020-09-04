import { Component, OnInit, OnDestroy, ViewContainerRef, ViewChild, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommentsService } from '../../services/comments.service';
import { AuthService } from '../../../auth/services/auth.service';
import { PusherService } from '../../services/pusher.service';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { NotificationComponent } from '../../components/notification/notification.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {
  @ViewChild('notificationContainer', { read: ViewContainerRef }) container;
  private currentUserSubscription: Subscription;
  private publicPusherSubscription: Subscription;
  private privatePusherSubscription: Subscription;

  public addCommentForm: FormGroup;
  public currentUser: User;
  public paginationConfig = {
    itemsPerPage: 0,
    currentPage: 0,
    totalItems: 0
  };

  constructor(
    public commentsService: CommentsService,
    private authService: AuthService,
    private pusherService: PusherService,
    public utilsService: UtilsService,
    private resolver: ComponentFactoryResolver
    ) {
        this.currentUserSubscription = this.authService.currentUser.subscribe(user => {
          this.currentUser = user?.user || null;
        });

        this.publicPusherSubscription = this.pusherService.publicPush.subscribe(e => {
          if (!e) { return; }
          switch (e.type) {
            case 'post_added':
              this.addCommentToList(e.data);
              break;
            case 'post_updated':
              this.updateComment(e.data);
              break;
            case 'post_deleted':
              this.deleteComment(e.data);
          }
        });

        this.privatePusherSubscription = this.pusherService.privatePush.subscribe(e => {
          if (!e) { return; }
          const factory = this.resolver.resolveComponentFactory(NotificationComponent);
          let componentRef: ComponentRef<any>;
          componentRef = this.container.createComponent(factory);
          componentRef.instance.title = e.data.post.title;
          componentRef.instance.user = e.data.user.name;
          componentRef.instance.isClosed.subscribe(() => componentRef.destroy());
          setTimeout(() => componentRef.destroy(), 60000);
          this.playAudio();
        });
    }

  ngOnInit(): void {

    this.addCommentForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      message: new FormControl('', [Validators.required, Validators.maxLength(65535)])
    });

    this.commentsService.getCommentsList().subscribe((data) => {
      this.commentsService.commentsList = data;

      this.paginationConfig.currentPage = this.commentsService.commentsList.meta.current_page;
      this.paginationConfig.itemsPerPage = this.commentsService.commentsList.meta.per_page;
      this.paginationConfig.totalItems = this.commentsService.commentsList.meta.total;

    }, err => console.error(err));
  }

  get title() { return this.addCommentForm.get('title'); }

  get message() { return this.addCommentForm.get('message'); }

  private addCommentToList(comment: any) {
    if (this.paginationConfig.currentPage === 1) {
      this.commentsService.commentsList.data.unshift(comment);
    }
  }

  private updateComment(comment: any) {
    this.commentsService.commentsList.data.map(c => {
      if (c.id === comment.id) {
        const toUpdate = this.commentsService.commentsList.data.indexOf(c);
        this.commentsService.commentsList.data[toUpdate] = comment;
      }
    });
  }

  private deleteComment(comment: any) {
    this.commentsService.commentsList.data = this.commentsService.commentsList.data.filter(c => c.id !== comment.id);
  }

  addComment() {
    if (this.addCommentForm.valid) {
      this.commentsService.addComment(this.title.value, this.message.value).subscribe(data => {
        this.addCommentToList(data);
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

  playAudio() {
    const audio = new Audio();
    audio.src = 'assets/audio/notification.mp3';
    audio.load();
    audio.play();
  }

  ngOnDestroy() {
    this.currentUserSubscription.unsubscribe();
    this.publicPusherSubscription.unsubscribe();
    this.privatePusherSubscription.unsubscribe();
    this.container.clear();
  }

}
