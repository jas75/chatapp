import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, retry, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Identity } from 'src/app/interfaces/identity';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = environment.url;
  constructor(
    private http: HttpClient
  ) { }

  register(credentials: any) {
    return this.http.post(this.url + '/api/user', credentials).pipe(
      catchError(e => {
        throw new Error(e);
      })
    );
  }

  login(credentials: any): Observable<Identity> {
    return this.http.post<Identity>(this.url + '/api/login', credentials).pipe(
      catchError(e => {
        throw new Error(e);
      })
    );
  }
}
