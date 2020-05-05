import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../authentication/auth.service';
import { tap } from 'rxjs/operators';
import { AlertService } from '../shared/alert.service';

@Injectable({
  providedIn: 'root'
})
export class MealsService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private alertService: AlertService) { }

  getMeals() {
    return this.http.get<any>(`${this.authService.rootUrl}/api/v1/meals/`);
  }
}
