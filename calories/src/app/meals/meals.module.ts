import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MealsRoutingModule } from './meals-routing.module';
import { HomeComponent } from './home/home.component';
import { DateAndMealsComponent } from './date-and-meals/date-and-meals.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AddMealFormComponent } from './add-meal-form/add-meal-form.component';


@NgModule({
  declarations: [HomeComponent, DateAndMealsComponent, AddMealFormComponent],
  imports: [
    CommonModule,
    MealsRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class MealsModule { }
