export interface IConversionSample {
  fromAmount: string;
  fromUnit: string;
  toAmount: string;
  toUnit: string;
}

export class ConversionSample implements IConversionSample {
  constructor() {
  }

  fromAmount: string;
  fromUnit: string;
  toAmount: string;
  toUnit: string;
}
