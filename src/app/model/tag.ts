import {Dish} from "./dish";

export interface ITag {
  tag_id: string;
  name: string;
  description: string;
  tag_type: string;
  power: number;
  parent_id: string;
  dishes: Dish[];
  assign_select: boolean;
  search_select: boolean;
  is_inverted: boolean;
  is_group: boolean;
  user_id: string;
  is_expanded: boolean;
  is_display: boolean;
}

export class Tag implements ITag {
  constructor() {
  }

  tag_id: string;
  name: string;
  description: string;
  tag_type: string;
  power: number;
  parent_id: string;
  dishes: Dish[];
  assign_select: boolean;
  search_select: boolean;
  is_inverted: boolean;
  is_group: boolean = false;
  user_id: string;
  is_expanded: boolean = false;
  is_display: boolean;
}
