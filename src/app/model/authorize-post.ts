import {UserDeviceInfo} from "./user-device-info";

export interface IAuthorizePost {
  username: string;
  password: string;
  device_info: UserDeviceInfo;

}

export class AuthorizePost implements IAuthorizePost {
  constructor() {
  }

  username: string;
  password: string;
  device_info: UserDeviceInfo;
}

