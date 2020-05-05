import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { tap, catchError, shareReplay } from 'rxjs/operators';
import { BehaviorSubject, throwError, Observable } from 'rxjs';
import { User } from './user';
import { Router } from '@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";

interface SigninCredentials {
  email: string,
  password: string,
}

interface RegisterCredentials {
  email: string,
  password: string,
  password2: string,
}

const jwtHelper = new JwtHelperService();

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

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {

    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();

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
          const user = new User({ email: credentials.email, token: response.token });
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
        }),
      );
  }

  register(credentials: RegisterCredentials) {
    const { email, password } = credentials;
    return this.http.post<{ token: string }>(`${this.rootUrl}/auth/register/`, { email, password }, this.httpOptions).pipe(
      tap(response => {
        console.log(response)
        const user = new User({ email: credentials.email, token: response.token });
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/']);
  }

  emailAvailable(email: string) {
    return this.http.get<{ available: boolean }>(`${this.rootUrl}/auth/register/?email=${email}`);
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  checkToken() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      const myRawToken = user.token;
      const decodedToken = jwtHelper.decodeToken(myRawToken);
      const expirationDate = jwtHelper.getTokenExpirationDate(myRawToken);
      const isExpired = jwtHelper.isTokenExpired(myRawToken);
      return { decodedToken, expirationDate, isExpired };
    }
    return null;
  }

  refreshToken() {
    let credentials = null;
    if (this.userValue) {
      const { token, refreshToken } = this.userValue;
      credentials = refreshToken ? refreshToken : token;
      return this.http.post<{ token: string }>(`${this.rootUrl}/api-token-refresh/`, { credentials }, this.httpOptions).pipe(
        tap(response => {
          const user = new User({ ...this.userValue, refreshToken: response.token });
          localStorage.setItem('user', JSON.stringify(user));
        })
      );
    }

  }

}
