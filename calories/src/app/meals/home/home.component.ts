import { Component, OnInit } from '@angular/core';
import { MealsService } from '../meals.service';
import { Meal, DateAndMeals } from '../meal';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  meals: Meal[] = [];
  dateAndMeals: DateAndMeals[] = [];

  constructor(private mealsService: MealsService) { }

  ngOnInit(): void {
    this.mealsService.getMeals().subscribe({
      next: meals => {
        this.dateAndMeals = this.displayMealsByDate(meals);
      }
    });
  }

  displayMealsByDate(meals: Meal[]): DateAndMeals[] {
    const date = new Date();
    const firstMealEntryDate = new Date(Date.parse(meals[0].time_created));
    let now = date;
    let filteredMeals = meals;
    let dateAndMealsArray: DateAndMeals[] = [];

    while (now.getDate() >= firstMealEntryDate.getDate()) {
      const dateAndMeals = {
        date: new Date(now),
        meals: filteredMeals.filter(meal => {
          const mealsDate = new Date(Date.parse(meal.updated));
          return now.getDate() === mealsDate.getDate();
        })
      }
      dateAndMealsArray.push(dateAndMeals);
      now.setDate(now.getDate() - 1);
    }
    return dateAndMealsArray;
  }

}
