export interface ITokenProcessPost {
    token_parameter: string;
    token_type: string;
    token: string;
}

export class TokenProcessPost implements ITokenProcessPost {
    constructor() {
    }

    token: string
    token_parameter: string;
    token_type: string;
}


