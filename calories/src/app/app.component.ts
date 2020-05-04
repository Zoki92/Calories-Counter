import { Component } from '@angular/core';
import { User } from './authentication/user';
import { AuthService } from './authentication/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'calories';
  user: User;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.user.subscribe(x => this.user = x);
    console.log("user ", this.user);
    if (this.user) {
      this.router.navigateByUrl('/home')
    }
  }

  logout() {
    this.authService.logout();
  }

}
