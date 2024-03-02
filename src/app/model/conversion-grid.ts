import {ConversionSample} from "./conversion-sample";

export interface IConversionGrid {
  sample: ConversionSample[];
}

export class ConversionGrid implements IConversionGrid {
  constructor() {
  }

  sample: ConversionSample[];
}
