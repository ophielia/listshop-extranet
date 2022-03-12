import {Slot} from "./slot";
export interface IMealPlan {
  meal_plan_id: string;
  user_id: string;
  name: string;
  created: Date;
  meal_plan_type: string;
  slots: Slot[];
}


export class MealPlan implements IMealPlan {
  constructor() {
  }

  meal_plan_id: string;
  user_id: string;
  name: string;
  created: Date;
  meal_plan_type: string;
  slots: Slot[];
}

