export interface ILegendSource {
  key: string;
  display: string;
}

export class LegendSource implements ILegendSource {
  constructor() {
  }

  key: string;
  display: string;
}