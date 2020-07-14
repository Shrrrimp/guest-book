import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommentsService } from '../../services/comments.service';
import { CommentsList, Comment } from '../../models/comment.model';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  public commentsList: CommentsList | null;
  public addCommentForm: FormGroup;

  constructor(private commentsService: CommentsService) { }

  ngOnInit(): void {
    this.addCommentForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      message: new FormControl('', [Validators.required, Validators.maxLength(65535)])
    });

    this.commentsService.getCommentsList().subscribe((data) => {
      this.commentsList = data;
    }, err => console.error(err));
  }

  get title() { return this.addCommentForm.get('title'); }

  get message() { return this.addCommentForm.get('message'); }

  addComment() {
    if (this.addCommentForm.valid) {
      this.commentsService.addComment(this.title.value, this.message.value).subscribe(data => {
        this.commentsList.data.unshift(data);
        this.addCommentForm.reset();
      }, err => console.error(err));
    }
  }

  updateComment(comment: Comment) {
    // TODO: поменять на данные из формы

    const title = `updated title. ${comment.title}`;
    const message = `updated message. ${comment.message}`;

    this.commentsService.updateComment(comment.id, title, message).subscribe((data) => {
      const toUpdate = this.commentsList.data.indexOf(comment);
      if (toUpdate !== -1) {
        this.commentsList.data[toUpdate] = data;
      }
    }, err => console.error(err));
  }

  deleteComment(comment: Comment) {
    this.commentsService.deleteComment(comment.id).subscribe(() => {
      this.commentsList.data = this.commentsList.data.filter(c => c.id !== comment.id);
    }, err => console.error(err));
  }

}
