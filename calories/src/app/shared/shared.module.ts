import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from './alert/alert.component';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { ModalComponent } from './modal/modal.component';



@NgModule({
  declarations: [InputComponent, AlertComponent, LoadingScreenComponent, ModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    InputComponent,
    AlertComponent,
    LoadingScreenComponent,
    ModalComponent,
  ]
})
export class SharedModule { }
