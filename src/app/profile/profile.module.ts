import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from '../profile/profile-routing.module';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnswerComponent } from './components/answer/answer.component';
import { CommentComponent } from './components/comment/comment.component';


@NgModule({
  declarations: [MainPageComponent, AnswerComponent, CommentComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProfileModule { }
