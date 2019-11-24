import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Relationship, RelationshipResponse } from 'src/app/interfaces/relationship';

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

  getUserRelationships(): Observable<RelationshipResponse> {
    return this.http.get<RelationshipResponse>(this.url + '/api/contact', this.createHttpHeaders()).pipe(tap(res => {
      return res;
    }),
    catchError(err => {
      return throwError(err);
    }));
  }
}
