export interface ITokenRequest {
  token_parameter: string;
  token_type: string;

}

export class TokenRequest implements ITokenRequest {
  constructor() {
  }

  token_parameter: string;
  token_type: string;
}

export enum TokenType {
  PasswordReset = 'PasswordReset'
}
