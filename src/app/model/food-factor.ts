export interface IFoodFactor {
  from_unit_id: string;
  to_unit_id: string;
  from_quantity: string;
  to_quantity: string;
}

export class FoodFactor implements IFoodFactor {
  constructor() {
  }

  from_unit_id: string;
  to_unit_id: string;
  from_quantity: string;
  to_quantity: string;

}
