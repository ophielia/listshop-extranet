import {SortKey} from "./sort-key";
import {SortDirection} from "./sort-direction";

export class DishSort {

    keys: SortKey[];
    direction: SortDirection[];

    static getKeys(): Array<SortKey> {
        let keys = [
            SortKey.Name,
            SortKey.CreatedOn,
            SortKey.LastUsed
        ];

        return keys;
    }

}


