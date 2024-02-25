export interface ITagOperationPut {
    tag_ids: string[];
    tag_operation_type: string;
    user_id: string;
    is_liquid: boolean;
}

export class TagOperationPut implements ITagOperationPut {
    constructor() {
    }

    tag_ids: string[];
    tag_operation_type: string;
    user_id: string;
    is_liquid: boolean;
}



