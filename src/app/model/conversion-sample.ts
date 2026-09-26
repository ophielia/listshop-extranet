export interface IConversionSample {
  fromAmount: string;
  fromUnit: string;
  toAmount: string;
  toUnit: string;
  userDefined: boolean;
}

export class ConversionSample implements IConversionSample {
  constructor() {
  }

  fromAmount: string;
  fromUnit: string;
  toAmount: string;
  toUnit: string;
  userDefined: boolean;
}
