export interface ICategoryMapping {
  tag_id: string;
  tag_name: string;
  food_category_id: string;
  food_category_name: string;
}


export class CategoryMapping implements ICategoryMapping {
  constructor() {
  }

  tag_id: string;
  tag_name: string;
  food_category_id: string;
  food_category_name: string;
}
