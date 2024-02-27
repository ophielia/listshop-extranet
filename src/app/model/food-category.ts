export interface IFoodCategory {
  food_category_id: string;
  food_category_name: string;
}


export class FoodCategory implements IFoodCategory {
  constructor() {
  }

  food_category_id: string;
  food_category_name: string;
}
