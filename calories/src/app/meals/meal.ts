export interface Meal {
    pk: number,
    text: string,
    num_calories: string,
    time_created: string,
    updated: string,
}


export interface DateAndMeals {
    date: Date,
    meals: Meal[],
}