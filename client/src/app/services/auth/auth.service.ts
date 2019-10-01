import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, retry, tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { User, Identity } from 'src/app/interfaces/identity';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public currentUserSubject = new BehaviorSubject<Identity>(null);
  public currentUser: Observable<Identity> = this.currentUserSubject.asObservable();


  url = environment.url;
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // let test;
    // if (localStorage.getItem('token')) {
    //   let user: Identity = {
    //     token:  
    //   }
    //   this.currentUserSubject.next()
    // } else {
    //   test = null;
    // }
    // const parse = '{"token":' + '"' + localStorage.getItem('token') + '"}';
    // this.currentUserSubject = new BehaviorSubject<Identity>(JSON.parse(parse));
    // this.currentUser = this.currentUserSubject.asObservable();
    // this.currentUser.subscribe(user => {
    //   console.log(user);
    // })


  }

  public get currentUserValue(): Identity {
      return this.currentUserSubject.value;
  }

  // isLoggedin(): boolean {
  //   if (this)
  // }

  register(credentials: any) {
    return this.http.post(this.url + '/api/user', credentials).pipe(
      catchError(e => {
        throw new Error(e);
      })
    );
  }

  login(credentials: any): Observable<Identity> {
    return this.http.post<Identity>(this.url + '/api/login', credentials).pipe(tap(identity => {
      localStorage.setItem('token', identity.token);
      localStorage.setItem('user', JSON.stringify(identity.user));
      this.currentUserSubject.next(identity);
      return identity;
    }),
      catchError(e => {
        throw new Error(e);
      })
    );
  }

  logout(): void {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
    // this.currentUserSubject.unsubscribe();
    //location.reload();
  }
}
