export interface IShoppingListPut {
  name: string;
  is_starter_list: boolean;
}

export class ShoppingListPut implements IShoppingListPut {
  constructor() {
  }

  name: string;
  is_starter_list: boolean;
}

