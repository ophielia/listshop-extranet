export interface IAdminUser {
  email: string;
  user_id: string;
  last_login: Date;
  creation_date: Date;
  list_count: number;
  dish_count: number;
  meal_plan_count: number;

}


export class AdminUser implements IAdminUser {

  constructor() {
  }

  email: string;
  user_id: string;
  last_login: Date;
  creation_date: Date;
  list_count: number;
  dish_count: number;
  meal_plan_count: number;
}
