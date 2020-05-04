import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from './signin/signin.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SignoutComponent } from './signout/signout.component';
import { AuthRoutingModule } from './auth-routing.module';



@NgModule({
  declarations: [SigninComponent, SignoutComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class AuthenticationModule { }
