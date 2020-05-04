import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { tap, catchError, shareReplay } from 'rxjs/operators';
import { BehaviorSubject, throwError, Observable } from 'rxjs';
import { User } from './user';
import { Router } from '@angular/router';

interface SigninCredentials {
  email: string,
  password: string,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  rootUrl = 'http://127.0.0.1:8000';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(private http: HttpClient, private router: Router) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log("an error occured ", error.error.message);
    }
    else {
      console.error(`Backend returned code ${error.status}`, `body was: ${error.error}`);
    }
    return throwError("Something happened. Please try again later");
  }

  signin(credentials: SigninCredentials) {
    return this.http
      .post<{ token: string }>(
        `${this.rootUrl}/api-token-auth/`,
        credentials,
        this.httpOptions
      )
      .pipe(
        tap(response => {
          const user = {
            'email': credentials.email,
            'token': response.token
          }
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
        }),
        shareReplay(),
        catchError(this.handleError),
      );
  }

  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/']);
  }

  public get userValue(): User {
    return this.userSubject.value;
  }


}
