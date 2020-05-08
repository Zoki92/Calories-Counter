import { Component, OnInit, Input } from '@angular/core';
import { DateAndMeals } from '../meal';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-date-and-meals',
  templateUrl: './date-and-meals.component.html',
  styleUrls: ['./date-and-meals.component.scss']
})
export class DateAndMealsComponent implements OnInit {
  @Input() dateAndMeals: DateAndMeals;
  showModal: boolean = false;
  caloriesOutput: string;
  calculatedCalories: number;

  caloryEntryForm = new FormGroup({
    caloriesInput: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$'),
    ])
  }
  );

  constructor() { }

  ngOnInit(): void {
  }

  checkCalories(caloriesEntry: number) {
    if (this.dateAndMeals.meals.length > 0) {
      this.calculatedCalories = this.dateAndMeals.meals.map(meal => parseFloat(meal.num_calories)).reduce((a, b) => a + b);
      if (this.calculatedCalories > caloriesEntry) {
        this.caloriesOutput = 'red';
      }
      else {
        this.caloriesOutput = 'green';
      }
    }
  }

  onSubmit() {
    if (this.caloryEntryForm.invalid) {
      return;
    }
    this.checkCalories(this.caloryEntryForm.value.caloriesInput);
  }

  reset() {
    this.caloryEntryForm.reset();
    this.caloriesOutput = null;
    this.calculatedCalories = null;
  }

}
