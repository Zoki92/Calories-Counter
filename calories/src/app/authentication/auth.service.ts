import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from "@angular/common/http";
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
      .post<{ access: string, refresh: string }>(
        `${this.rootUrl}/api/token/`,
        credentials,
        this.httpOptions
      )
      .pipe(
        tap(response => {
          const user = new User({ email: credentials.email, token: response.access, refreshToken: response.refresh });
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
        }),
      );
  }

  register(credentials: RegisterCredentials) {
    const { email, password } = credentials;
    return this.http.post<{ access: string, refresh: string }>(`${this.rootUrl}/auth/register/`, { email, password }, this.httpOptions).pipe(
      tap(response => {
        const user = new User({ email: credentials.email, token: response.access, refreshToken: response.refresh });
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
      const myRawToken = user.access;
      const decodedToken = jwtHelper.decodeToken(myRawToken);
      const expirationDate = jwtHelper.getTokenExpirationDate(myRawToken);
      const isExpired = jwtHelper.isTokenExpired(myRawToken);
      return { decodedToken, expirationDate, isExpired };
    }
    return null;
  }

  refreshToken() {
    if (this.userValue) {
      const refresh = this.userValue.refreshToken;
      return this.http.post<{ access: string }>(`${this.rootUrl}/api/token/refresh/`, { refresh }, this.httpOptions).pipe(
        tap(response => {
          const user = new User({ ...this.userValue, token: response.access });
          localStorage.setItem('user', JSON.stringify(user));
        }),
      );
    }

  }

}
