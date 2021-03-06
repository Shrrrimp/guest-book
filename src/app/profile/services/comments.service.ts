import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommentsList, Comment } from '../models/comment.model';
import { Answer, AnswersList } from '../models/answer.model';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  public baseUrl = environment.apiUrl;
  public postsUrl = 'api/v1/posts';
  public commentsList: CommentsList;

  constructor(private http: HttpClient) { }

  getCommentsList(): Observable<CommentsList> {
    return this.http.get<CommentsList>(`${this.baseUrl}${this.postsUrl}`);
  }

  getNextCommentsPage(page: number): Observable<CommentsList> {
    return this.http.get<CommentsList>(`${this.baseUrl}${this.postsUrl}?page=${page}`);
  }

  addComment(title: string, message: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}${this.postsUrl}`, {title, message});
  }

  deleteComment(commentId: number): Observable<{}> {
    return this.http.delete(`${this.baseUrl}${this.postsUrl}/${commentId}`);
  }

  updateComment(commentId: number, title: string, message: string): Observable<Comment> {
    return this.http.put<Comment>(`${this.baseUrl}${this.postsUrl}/${commentId}`, {title, message});
  }

  getAnswersList(commentId: number): Observable<AnswersList> {
    return this.http.get<AnswersList>(`${this.baseUrl}${this.postsUrl}/${commentId}/answers`);
  }

  getNextAnswersPage(commentId: number, page: number): Observable<AnswersList> {
    return this.http.get<AnswersList>(`${this.baseUrl}${this.postsUrl}/${commentId}/answers?page=${page}`);
  }

  addAnswer(commentId: number, message: string): Observable<Answer> {
    return this.http.post<Answer>(`${this.baseUrl}${this.postsUrl}/${commentId}/answers`, {message});
  }

  deleteAnswer(commentId: number, answerId: number): Observable<{}> {
    return this.http.delete(`${this.baseUrl}${this.postsUrl}/${commentId}/answers/${answerId}`);
  }
}
