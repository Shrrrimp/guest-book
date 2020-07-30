import { Component, OnInit, Input } from '@angular/core';
import { Answer } from '../../models/answer.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss']
})
export class AnswerComponent implements OnInit {

  @Input() public answer: Answer | null;
  @Input() public currentUser: User | null;

  constructor() { }

  ngOnInit(): void {
  }

}
