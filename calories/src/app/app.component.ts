import { Component } from '@angular/core';
import { User } from './authentication/user';
import { AuthService } from './authentication/auth.service';
import { Router } from '@angular/router';
import { AlertService } from './shared/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'calories';
  user: User;

  constructor(private authService: AuthService, private router: Router, private alertService: AlertService) {
    this.authService.user.subscribe(x => this.user = x);
    this.router.navigateByUrl('/home');
    console.log("here app comp");
  }

  logout() {
    this.alertService.success("You have logged out!", { keepAfterRouteChange: true, fade: true });
    this.authService.logout();
  }

}
