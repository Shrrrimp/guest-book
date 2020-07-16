import { Component, OnInit, Input } from '@angular/core';
import { Comment } from '../../models/comment.model';
import { CommentsService } from '../../services/comments.service';
import { AnswersList } from '../../models/answer.model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() public comment: Comment | undefined;
  public answersList: AnswersList | null;

  constructor(public commentsService: CommentsService) { }

  ngOnInit(): void {
  }

  updateComment(comment: Comment) {
    // TODO: поменять на данные из формы

    const title = `updated title. ${comment.title}`;
    const message = `updated message. ${comment.message}`;

    this.commentsService.updateComment(comment.id, title, message).subscribe((data) => {
      const toUpdate = this.commentsService.commentsList.data.indexOf(comment);
      if (toUpdate !== -1) {
        this.commentsService.commentsList.data[toUpdate] = data;
      }
    }, err => console.error(err));
  }

  deleteComment(comment: Comment) {
    this.commentsService.deleteComment(comment.id).subscribe(() => {
      this.commentsService.commentsList.data = this.commentsService.commentsList.data.filter(c => c.id !== comment.id);
    }, err => console.error(err));
  }

  showAnswersList(comment: Comment) {
    this.commentsService.getAnswersList(comment.id).subscribe((data) => {

      console.log('answers:');
      console.log(data);

      this.answersList = data;
    }, err => console.error(err));
  }

}
