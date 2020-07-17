import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommentsService } from '../../services/comments.service';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  public addCommentForm: FormGroup;

  constructor(public commentsService: CommentsService) { }

  ngOnInit(): void {
    this.addCommentForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      message: new FormControl('', [Validators.required, Validators.maxLength(65535)])
    });

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
