import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.scss']
})
export class ModalDialogComponent implements OnInit {

  @Input() title: string;
  @Input() message: string;
  @Output() isConfirmed: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  confirm(): void {
    this.isConfirmed.emit(true);
  }

  close(): void {
    this.isConfirmed.emit(false);
  }

}
