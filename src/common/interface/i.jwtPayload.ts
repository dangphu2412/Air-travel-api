export interface IUserInfo {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  avatar: string;
  role: string;
}

export interface IUserLoginResponse extends IUserInfo {
  token: string;
}
