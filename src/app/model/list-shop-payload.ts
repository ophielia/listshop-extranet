export interface IListShopPayload {
    parameters: string[];
}


export class ListShopPayload implements IListShopPayload {

    constructor() {
    }

    parameters: string[] = [];
}
