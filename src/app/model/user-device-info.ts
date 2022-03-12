
export interface IUserDeviceInfo {
  name : string;
  model : string;
  os : string;
  os_version : string;
  client_type : string;
  client_version : string;
  build_number : string;
  device_id : string;
}


export class UserDeviceInfo implements IUserDeviceInfo {
  name : string;
  model : string;
  os : string;
  os_version : string;
  client_type : string;
  client_version : string;
  build_number : string;
  device_id : string;

  constructor() {
  }

}
