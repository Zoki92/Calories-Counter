import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { AlertService } from 'src/app/shared/alert.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  authForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,

    ])
  });

  loading = false;
  submitted = false;
  returnUrl: string;


  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();

    if (this.authForm.invalid) {
      return;
    }
    this.loading = true;
    return this.authService.signin(this.authForm.value).subscribe({
      next: response => {
        this.router.navigateByUrl('/home');
        this.alertService.success("You have signed in!", { keepAfterRouteChange: true, autoClose: true });
      },
      error: ({ error }) => {
        this.loading = false;
        this.alertService.error(error.detail);
        if (error.detail) {
          this.authForm.setErrors({
            credentials: true
          });
        }
        else {
          this.authForm.setErrors({
            unknownError: true
          });
        }
      },

    })
  }

}
