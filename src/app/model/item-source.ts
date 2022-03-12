export interface IItemSource {
  id: string;
  display: string;
  type: string;
  disp_class: string;
}

export class ItemSource implements IItemSource {
  constructor() {
  }

  id: string;
  display: string;
  type: string;
  disp_class: string;
}
