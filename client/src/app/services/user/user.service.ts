import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { User, UsersResponse } from 'src/app/interfaces/identity';

@Injectable({
  providedIn: 'root'
})
export class UserService {

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

  getUsersSuggestions(params: string): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(this.url + '/api/user/suggestions/' + params, this.createHttpHeaders())
    .pipe(tap(res => {
      if (res) {
        return res.users;
      } else {
        return null;
      }
    }),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  getUserById(id): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(this.url + '/api/user/' + id, this.createHttpHeaders())
    .pipe(tap(res => {
      return res;
    }),
    catchError(err => {
      return throwError(err);
    }));
  }

}
