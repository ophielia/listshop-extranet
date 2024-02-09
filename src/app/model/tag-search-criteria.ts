import TagType from "./tag-type";

export interface ITagSearchCriteria {
    user_id: string;
    text_fragment: string;
    tag_types: TagType[];
    group_include: string;
    included_statuses: string[];
    excluded_statuses: string[];
}

export class TagSearchCriteria implements ITagSearchCriteria {
    constructor() {
    }

    user_id: string;
    text_fragment: string;
    tag_types: TagType[];
    group_include: string;
    included_statuses: string[];
    excluded_statuses: string[];
}
