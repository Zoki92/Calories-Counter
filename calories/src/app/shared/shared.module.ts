import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from './alert/alert.component';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';



@NgModule({
  declarations: [InputComponent, AlertComponent, LoadingScreenComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    InputComponent,
    AlertComponent,
    LoadingScreenComponent,
  ]
})
export class SharedModule { }
