import {IRatingInfo} from "./rating-info";

export interface IDishRatingInfo {
  dish_id: number;
  dish_name: string;
  ratings: IRatingInfo[];
}

export class DishRatingInfo implements IDishRatingInfo {
  constructor() {
  }

  dish_id: number;
  dish_name: string;
  ratings: IRatingInfo[];
}

