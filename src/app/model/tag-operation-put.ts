export interface ITagOperationPut {
    tag_ids: string[];
    tag_operation_type: string;
    user_id: string;
    is_liquid: boolean;
    assign_id: string;
}

export class TagOperationPut implements ITagOperationPut {
    constructor() {
    }

    tag_ids: string[];
    tag_operation_type: string;
    user_id: string;
    is_liquid: boolean;
    assign_id: string;
}



