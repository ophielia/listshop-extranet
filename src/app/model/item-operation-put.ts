import {ITag} from "./tag";
import {IItemSource} from "./item-source";
import {IItem} from "./item";
export interface IItemOperationPut {
  destination_list_id: string;
  operation: string;
  tag_ids: string[];
}

export class ItemOperationPut implements IItemOperationPut {
  constructor() {
  }

  destination_list_id: string;
  operation: string;
  tag_ids: string[];

}
