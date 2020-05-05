import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/shared/alert.service';

@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.scss']
})
export class SignoutComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private alertService: AlertService) { }

  ngOnInit(): void {
    this.authService.logout();
  }

}
