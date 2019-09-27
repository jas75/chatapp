import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, retry, tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { User, Identity } from 'src/app/interfaces/identity';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<Identity>;
  public currentUser: Observable<Identity>;


  url = environment.url;
  constructor(
    private http: HttpClient
  ) {
    const parse = '{"token":' + '"' + localStorage.getItem('token') + '"}';
    this.currentUserSubject = new BehaviorSubject<Identity>(JSON.parse(parse));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Identity {
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
    return this.http.post<Identity>(this.url + '/api/login', credentials).pipe(tap(identity => {
      console.log(identity);
      localStorage.setItem('token', identity.token);
      this.currentUserSubject.next(identity);
      return identity;
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
