import {ConversionGrid} from "./conversion-grid";

export interface IFood {
  food_id: string;
  category_id: string;
  name: string;
  factors: ConversionGrid;
}

export class Food implements IFood {
  constructor() {
  }

  food_id: string;
  category_id: string;
  name: string;
  factors: ConversionGrid;
}
