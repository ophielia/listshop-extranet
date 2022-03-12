export class IListGenerateProperties {
  dish_sources: string[];
  meal_plan_source: string;
  add_from_starter: boolean;
  generate_mealplan: boolean;
  list_name: string;

}


export class ListGenerateProperties implements IListGenerateProperties {
  constructor() {
  }

  dish_sources: string[];
  meal_plan_source: string;
  add_from_starter: boolean;
  generate_mealplan: boolean;
  list_name: string;

}

