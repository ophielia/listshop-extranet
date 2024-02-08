export interface ITagSearchCriteria {
    user_id: string;
    text_fragment: string;
    tag_type: string;
    group_include_type: string;
    included_statuses: string[];
    excluded_statuses: string[];
}

export class TagSearchCriteria implements ITagSearchCriteria {
    constructor() {
    }

    user_id: string;
    text_fragment: string;
    tag_type: string;
    group_include_type: string;
    included_statuses: string[];
    excluded_statuses: string[];
}
