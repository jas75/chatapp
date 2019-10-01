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
  ) {}

  public get currentUserValue(): Identity {
      return this.currentUserSubject.value;
  }

  register(credentials: any): Observable<any> {
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }
}
