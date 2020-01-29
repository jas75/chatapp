import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Relationship, RelationshipResponse, RoomResponse } from 'src/app/interfaces/relationship';

@Injectable({
  providedIn: 'root'
})
export class ContactService {


  url = environment.url;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }


  private createHttpHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
  }

  sendFriendRequestTo(recipient: any): Observable<any> {
    return this.http.post(this.url + '/api/contact', recipient).pipe(tap(res => {
      return res;
    }),
    catchError(e => {
      return throwError(e);
    }));
  }

  getUserRelationshipById(id): Observable<Relationship> {
    return this.http.get<Relationship>(this.url + '/api/contact/' + id, this.createHttpHeaders()).pipe(tap(res => {
      return res;
    }),
    catchError(err => {
      return throwError(err);
    }));
  }

  // get all user relationships including friend request to list in dashboard
  getUserRelationships(): Observable<RoomResponse> {
    return this.http.get<RoomResponse>(this.url + '/api/contact', this.createHttpHeaders()).pipe(tap(res => {
      return res;
    }),
    catchError(err => {
      return throwError(err);
    }));
  }

  // accept a friend request
  acceptFriendRequest(sender: any) {
    return this.http.post(this.url + '/api/friend-request/confirm', sender, this.createHttpHeaders()).pipe(tap(res => {
      return res;
    }),
    catchError(err => {
      return throwError(err);
    }));
  }


  // deny a friend request
  denyFriendRequest(senderid: string) {
    return this.http.delete(this.url + '/api/friend-request/deny/' + senderid, this.createHttpHeaders()).pipe(tap(res => {
      return res;
    }),
    catchError(err => {
      return throwError(err);
    }));
  }
}
