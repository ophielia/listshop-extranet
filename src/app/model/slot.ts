import {Dish} from "./dish";
import {ITag} from "./tag";

export interface ISlot {
  slot_id: string;
  dish: Dish;
  //MM dont need this i think meal_plan_id: string;
}


export class Slot implements ISlot {
  constructor() {
  }

  slot_id: string;
  dish: Dish;

}
