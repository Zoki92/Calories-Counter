import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateAndMealsComponent } from './date-and-meals.component';

describe('DateAndMealsComponent', () => {
  let component: DateAndMealsComponent;
  let fixture: ComponentFixture<DateAndMealsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateAndMealsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateAndMealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
