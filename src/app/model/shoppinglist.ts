import {IItemSource} from "./item-source";
import {Category} from "./category";
import {ILegendSource} from "./legend-source";

export interface IShoppingList {
  is_starter: boolean;
  list_id: string;
  categories: Category[];
  user_id: string;
  created: number;
  updated: number;
  list_type: string;
  layout_type: string;
  item_count: number;
  name: string;
  legend: ILegendSource[];
}

export class ShoppingList implements IShoppingList {
  constructor() {
  }
  is_starter: boolean;
  list_id: string;
  categories: Category[];
  user_id: string;
  created: number;
  updated: number;
  list_type: string;
  layout_type: string;
  item_count: number;
  name: string;
  legend: ILegendSource[];
}

