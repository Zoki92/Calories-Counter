import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-add-meal-form',
  templateUrl: './add-meal-form.component.html',
  styleUrls: ['./add-meal-form.component.scss']
})
export class AddMealFormComponent implements OnInit {
  @Input() date: Date;
  constructor() { }

  ngOnInit(): void {
  }

}
