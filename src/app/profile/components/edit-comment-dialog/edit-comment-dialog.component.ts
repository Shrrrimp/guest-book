import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-comment-dialog',
  templateUrl: './edit-comment-dialog.component.html',
  styleUrls: ['./edit-comment-dialog.component.scss']
})
export class EditCommentDialogComponent implements OnInit {
  public editCommentForm: FormGroup;
  @Input() title: string;
  @Input() message: string;
  @Output() isConfirmed: EventEmitter<object> = new EventEmitter<object>();

  constructor() { }

  ngOnInit(): void {
    this.editCommentForm = new FormGroup({
      titleInpt: new FormControl(this.title, [Validators.required, Validators.maxLength(255)]),
      messageInpt: new FormControl(this.message, [Validators.required, Validators.maxLength(65535)])
    });
  }

  get titleInpt() { return this.editCommentForm.get('titleInpt'); }

  get messageInpt() { return this.editCommentForm.get('messageInpt'); }

  confirm(): void {
    this.isConfirmed.emit({title: this.titleInpt.value, message: this.messageInpt.value});
  }

  close(): void {
    this.isConfirmed.emit(null);
  }

}
