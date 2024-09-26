import {ConversionGrid} from "./conversion-grid";

export interface ITagFullInfo {
    tag_id: string;
    name: string;
    description: string;
    tag_type: string;
    power: number;
    parent_id: string;
    parent_name: string;
    is_group: boolean;
    is_liquid: boolean;
    conversion_id: string;
    food_id: string;
    food_name: string;
    layout_category: string;
    layout_category_id: string;
    user_id: string;
    status: string;
    samples: ConversionGrid;
}

export class TagFullInfo implements ITagFullInfo {
    constructor() {
    }

    tag_id: string;
    name: string;
    description: string;
    tag_type: string;
    power: number;
    parent_id: string;
    parent_name: string;
    is_group: boolean;
    is_liquid: boolean;
    conversion_id: string;
    food_id: string;
    food_name: string;
    user_id: string;
    status: string;
    samples: ConversionGrid;
    layout_category: string;
    layout_category_id: string;
}
