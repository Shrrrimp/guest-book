import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommentsService } from '../../services/comments.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  public addCommentForm: FormGroup;
  public currentUserPic: string;
  public currentUserName: string;

  constructor(public commentsService: CommentsService, private authService: AuthService) { }

  ngOnInit(): void {
    this.addCommentForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      message: new FormControl('', [Validators.required, Validators.maxLength(65535)])
    });

    this.currentUserPic = 'assets/images/no_avatar.png';

    // TODO: загрузка юзер картинки
    // this.authService.getCurrentUserPic().subscribe(data => {
    //   this.currentUserPic = data;
    // }, err => console.error(err));

    this.currentUserName = this.authService.getCurrentUserName();

    this.commentsService.getCommentsList().subscribe((data) => {
      this.commentsService.commentsList = data;

      console.log('comments:');
      console.log(this.commentsService.commentsList);

    }, err => console.error(err));
  }

  get title() { return this.addCommentForm.get('title'); }

  get message() { return this.addCommentForm.get('message'); }

  addComment() {
    if (this.addCommentForm.valid) {
      this.commentsService.addComment(this.title.value, this.message.value).subscribe(data => {
        this.commentsService.commentsList.data.unshift(data);
        this.addCommentForm.reset();
      }, err => console.error(err));
    }
  }

}
