import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, retry, tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;


  url = environment.url;
  constructor(
    private http: HttpClient
  ) {
    const parse = '{"token":' + '"' + localStorage.getItem('token') + '"}';
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(parse));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
      return this.currentUserSubject.value;
  }

  register(credentials: any) {
    return this.http.post(this.url + '/api/user', credentials).pipe(
      catchError(e => {
        throw new Error(e);
      })
    );
  }

  login(credentials: any) {
    return this.http.post<User>(this.url + '/api/login', credentials).pipe(tap(user => {
      localStorage.setItem('token', user.token);
      this.currentUserSubject.next(user);
      return user.token;
    }),
      catchError(e => {
        throw new Error(e);
      })
    );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    location.reload();
  }
}
