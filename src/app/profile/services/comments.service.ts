import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommentsList, Comment } from '../models/comment.model';

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

  addComment(title: string, message: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}${this.postsUrl}`, {title, message});
  }

  deleteComment(commentId: number): Observable<{}> {
    return this.http.delete(`${this.baseUrl}${this.postsUrl}/${commentId}`);
  }

  updateComment(commentId: number, title: string, message: string): Observable<Comment> {
    return this.http.put<Comment>(`${this.baseUrl}${this.postsUrl}/${commentId}`, {title, message});
  }
}
