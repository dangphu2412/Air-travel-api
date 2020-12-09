import {TValidateUser} from "./t.Validate";

export type TJwtPayload = {
  userId: number;
  type: TValidateUser;
}
