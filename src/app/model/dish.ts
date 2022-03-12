import {ITag} from "./tag";
export interface IDish {
  dish_id: string;
  name: string;
  description: string;
  reference: string;
  last_added: number;
  user_id: string;
  tags: ITag[];
}


export class Dish implements IDish {

  constructor() {
  }


  dish_id: string;
  name: string;
  description: string;
  reference: string;
  last_added: number;
  user_id: string;
  tags: ITag[];
}
