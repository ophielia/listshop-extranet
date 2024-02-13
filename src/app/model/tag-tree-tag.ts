export interface ITagTreeTag {
    tag_id: string;
    name: string;
    description: string;
    tag_type: string;
    power: number;
    parent_id: string;
    is_group: boolean;
    user_id: string;
    is_expanded: boolean;
    is_display: boolean;
    tagGroups: ITagTreeTag[];
    tagChildren: ITagTreeTag[];
}

export class TagTreeTag implements ITagTreeTag {
    constructor() {
    }

    tag_id: string;
    name: string;
    description: string;
    tag_type: string;
    power: number;
    parent_id: string;
    is_group: boolean;
    user_id: string;
    is_expanded: boolean;
    is_display: boolean;
    tagGroups: ITagTreeTag[];
    tagChildren: ITagTreeTag[];
}
