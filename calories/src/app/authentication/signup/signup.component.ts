import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatchPasswords } from '../validators/match-passwords';
import { UniqueEmail } from '../validators/unique-email';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/shared/alert.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  authForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ], [
      this.uniqueEmail.validate
    ]),
    password: new FormControl('', [
      Validators.required,
    ]),
    password2: new FormControl('', [
      Validators.required
    ]),
  }, {
    validators: [
      this.matchPasswords.validate
    ]
  }
  );

  constructor(
    private matchPasswords: MatchPasswords,
    private uniqueEmail: UniqueEmail,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.authForm.invalid) {
      return;
    }
    this.authService.register(this.authForm.value).subscribe({
      next: response => {
        this.alertService.success("You have successfully create an account!", { keepAfterRouteChange: true, autoClose: true });
        this.router.navigateByUrl('/home')
      },
      error: err => {
        if (!err.status) {
          this.authForm.setErrors({
            noConnection: true
          })
        }
        else {
          this.authForm.setErrors({
            unknownError: true
          })
        }
      }
    }
    );
  }
}
