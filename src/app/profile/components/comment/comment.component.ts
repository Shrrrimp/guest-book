import { Component, OnInit, Input } from '@angular/core';
import { Comment } from '../../models/comment.model';
import { CommentsService } from '../../services/comments.service';
import { AnswersList } from '../../models/answer.model';
import { User } from '../../models/user.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() public comment: Comment | undefined;
  @Input() public currentUser: User | null;
  public addAnswerForm: FormGroup;
  public answersList: AnswersList | null;

  public faCaretUp = faCaretUp;
  public isAnswersListVisible = false;
  public arrowAngle = 180;
  public paginationConfig = {
    id: '',
    itemsPerPage: 0,
    currentPage: 1,
    totalItems: 0
  };
  public isModalDialogVisible = false;
  public isEditDialogVisible = false;
  public modalTitle = 'Are you sure?';
  public modalMessage = 'Do you want to delete message?';

  constructor(public commentsService: CommentsService, public utilsService: UtilsService) { }

  ngOnInit(): void {
    this.addAnswerForm = new FormGroup({
      message: new FormControl('', [Validators.required, Validators.maxLength(65535)])
    });
  }

  updateComment(comment: Comment, title: string, message: string) {
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

  deleteAnswer(answerId) {
    this.answersList.data = this.answersList.data.filter(answer => answer.id !== answerId.id);
    --this.comment.answers_count;
  }

  showModal() {
    this.isModalDialogVisible = true;
  }

  showEditModal() {
    this.isEditDialogVisible = true;
  }

  closeModal($event: boolean, comment: Comment) {
    this.isModalDialogVisible = false;
    if ($event) {
      this.deleteComment(comment);
    }
  }

  closeEditModal($event: any, comment: Comment) {
    this.isEditDialogVisible = false;
    if ($event) {
      this.updateComment(comment, $event.title, $event.message);
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

  toggle(comment: Comment) {
    if (this.isAnswersListVisible) {
      this.isAnswersListVisible = false;
      this.arrowAngle = 180;
    } else {
      this.isAnswersListVisible = true;
      this.arrowAngle = 0;

      if (!this.answersList) {
        this.showAnswersList(comment);
      }
    }
  }

  onPageChange($event) {
    this.paginationConfig.currentPage = $event;
    this.commentsService.getNextAnswersPage(this.comment.id, $event).subscribe((data) => {
      this.answersList = data;
      this.paginationConfig.totalItems = this.answersList.meta.total;
    });
  }

  get message() { return this.addAnswerForm.get('message'); }

  async addAnswer() {
    if (!this.addAnswerForm.valid) { return; }

    if (!this.answersList) {
      this.answersList = await this.commentsService.getAnswersList(this.comment.id).toPromise();
    }

    this.commentsService.addAnswer(this.comment.id, this.message.value).subscribe(data => {
      if (this.paginationConfig.currentPage === this.answersList.meta.last_page) {
        this.answersList.data.push(data);
      }

      ++this.comment.answers_count;
      this.addAnswerForm.reset();
    }, err => console.error(err));
  }

}
