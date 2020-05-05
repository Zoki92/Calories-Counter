import { Component, OnInit } from '@angular/core';
import { MealsService } from '../meals.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  meals = [];

  constructor(private mealsService: MealsService) { }

  ngOnInit(): void {
    this.mealsService.getMeals().subscribe(meals => {
      this.meals = meals;
    })
  }

}
