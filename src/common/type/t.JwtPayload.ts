import {TValidateUser} from "./t.Validate";

export type TJwtPayload = {
  userId: number;
  permissions: string[];
  type: TValidateUser;
}
