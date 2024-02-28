export interface IFood {
  food_id: string;
  category_id: string;
  name: string;

}

export class Food implements IFood {
  constructor() {
  }

  food_id: string;
  category_id: string;
  name: string;
}
