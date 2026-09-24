import RoleType from "./role-type";

export interface IUnit {
  unit_id: string;
  name: string;
}


export class Unit implements IUnit {

  constructor() {
  }

  unit_id: string;
  name: string;

}


export interface IUnitList {
  unit_list: IUnit[];
}


export class UnitList implements IUnitList {

  constructor() {
  }

  unit_list: IUnit[];
}
