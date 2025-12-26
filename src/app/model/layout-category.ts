export interface ILayoutCategory {
    category_id: string;
    name: string;
}


export class LayoutCategory implements ILayoutCategory {
    constructor(
        public category_id: string,
        public name: string,
    ) {
    }
}

