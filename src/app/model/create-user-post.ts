import {UserDeviceInfo} from "./user-device-info";
import {User} from "./user";

export interface ICreateUserPost  {
  user: User;
  device_info: UserDeviceInfo;

}

export class CreateUserPost implements ICreateUserPost {
  constructor() {
  }

  user: User;
  device_info: UserDeviceInfo;
}


export default class CreatUserStatus {

  static Success: string = "Success";
  static NameNotAvailable: string = "NameNotAvailable";
  static PasswordsDontMatch: string = "PasswordsDontMatch";
  static EmailTooShort: string = "EmailTooShort";




}