export interface ILegendPoint {
  key: string;
  display: string;
  icon: string;
  color: string;
}

export class LegendPoint implements ILegendPoint {
  constructor() {
  }

  key: string;
  display: string;
  icon: string;
  color: string;
}
