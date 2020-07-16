import { Component, OnInit, Input } from '@angular/core';
import { Answer } from '../../models/answer.model';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss']
})
export class AnswerComponent implements OnInit {

  @Input() public answer: Answer | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
