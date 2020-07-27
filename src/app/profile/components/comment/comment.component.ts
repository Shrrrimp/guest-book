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
  public paginationConfig = {
    id: '',
    itemsPerPage: 0,
    currentPage: 0,
    totalItems: 0
  };
  public isModalDialogVisible = false;
  public modalMessage = 'Do you want to delete message?';

  constructor(public commentsService: CommentsService) { }

  ngOnInit(): void {}

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

  showModal() {
    this.isModalDialogVisible = true;
  }

  closeModal($event: boolean, comment: Comment) {
    this.isModalDialogVisible = false;
    if ($event) {
      this.deleteComment(comment);
    }
  }

  showAnswersList(comment: Comment) {
    this.commentsService.getAnswersList(comment.id).subscribe((data) => {
      this.answersList = data;

      console.log('list:');
      console.log(this.answersList);

      this.paginationConfig.id = `${comment.id}`;
      this.paginationConfig.currentPage = this.answersList.meta.current_page;
      this.paginationConfig.itemsPerPage = this.answersList.meta.per_page;
      this.paginationConfig.totalItems = this.answersList.meta.total;
    }, err => console.error(err));
  }

  onPageChange($event) {
    this.paginationConfig.currentPage = $event;
    this.commentsService.getNextAnswersPage(this.comment.id, $event).subscribe((data) => {
      this.answersList = data;
    });
  }

  // ToDO: переделать под данные из формы
  addAnswer() {
    if (!this.answersList) {
      this.commentsService.getAnswersList(this.comment.id).subscribe((data) => {
        this.answersList = data;
      });
    }

    this.commentsService.addAnswer(this.comment.id, 'hi, Im answer').subscribe(data => {
      this.answersList.data.unshift(data);
    }, err => console.error(err));
  }

}
