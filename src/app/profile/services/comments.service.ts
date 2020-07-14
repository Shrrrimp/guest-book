import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommentsList, Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  public baseUrl = environment.apiUrl;
  public commentsList: CommentsList;

  constructor(private http: HttpClient) { }

  getCommentsList(): Observable<CommentsList> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.token}`});
    const options = { headers };
    return this.http.get<CommentsList>(`${this.baseUrl}api/v1/posts`, options);
  }

  addComment(title: string, message: string): Observable<Comment> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.token}`});
    const options = { headers };
    return this.http.post<Comment>(`${this.baseUrl}api/v1/posts`, {title, message}, options);
  }

  deleteComment(commentId: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.token}`});
    const options = { headers };
    return this.http.delete(`${this.baseUrl}api/v1/posts/${commentId}`, options);
  }

  updateComment(commentId: number, title: string, message: string): Observable<Comment> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.token}`});
    const options = { headers };
    return this.http.put<Comment>(`${this.baseUrl}api/v1/posts/${commentId}`, {title, message}, options);
  }
}
