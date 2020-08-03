import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Answer } from '../../models/answer.model';
import { User } from '../../models/user.model';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { CommentsService } from '../../services/comments.service';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss']
})
export class AnswerComponent implements OnInit {

  @Input() public answer: Answer | null;
  @Input() public currentUser: User | null;
  @Output() public deleted: EventEmitter<number> = new EventEmitter<number>();
  public isDeleted = false;

  constructor(public utilsService: UtilsService, private commentsService: CommentsService) { }

  ngOnInit(): void {
  }

  deleteAnswer(answer: Answer) {
    this.commentsService.deleteAnswer(answer.post_id, answer.id).subscribe((data) => {
      this.deleted.emit(answer.id);
      this.isDeleted = true;
    }, err => console.error(err));
  }

}
