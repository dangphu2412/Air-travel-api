import { TUserInfo } from "../type";

export interface IUserLoginResponse {
  access_token: string;
  info: TUserInfo;
}