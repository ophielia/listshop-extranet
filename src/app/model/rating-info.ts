export interface IRatingInfo {
  rating_tag_id: number;
  label: string;
  power: number;
  max_power: number;
  orig_power: number;
}

export class RatingInfo implements IRatingInfo {
  constructor() {
  }

  rating_tag_id: number;
  label: string;
  power: number;
  max_power: number;
  orig_power: number;
}
