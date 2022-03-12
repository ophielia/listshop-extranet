import {UserDeviceInfo} from "./user-device-info";
import {User} from "./user";

export interface ICreateListPost  {
  name: string;
  is_starter_list: boolean;
}

export class CreateListPost implements ICreateListPost {
  constructor() {
  }

  name: string;
  is_starter_list: boolean;
}
