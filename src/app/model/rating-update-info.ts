import {IRatingInfo} from "./rating-info";
import {IDishRatingInfo} from "./dish-rating-info";

export interface IRatingUpdateInfo {
    headers: IRatingInfo[];
  dish_ratings: IDishRatingInfo[];

}

export class RatingUpdateInfo implements IRatingUpdateInfo {
  constructor() {
  }

  headers: IRatingInfo[];
  dish_ratings: IDishRatingInfo[];
}
