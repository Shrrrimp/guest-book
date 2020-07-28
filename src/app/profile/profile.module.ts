import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from '../profile/profile-routing.module';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnswerComponent } from './components/answer/answer.component';
import { CommentComponent } from './components/comment/comment.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalDialogComponent } from './components/modal-dialog/modal-dialog.component';
import { EditCommentDialogComponent } from './components/edit-comment-dialog/edit-comment-dialog.component';


@NgModule({
  declarations: [
    MainPageComponent,
    AnswerComponent,
    CommentComponent,
    ModalDialogComponent,
    EditCommentDialogComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ]
})
export class ProfileModule { }
