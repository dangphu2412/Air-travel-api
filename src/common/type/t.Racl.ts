import {TCrudAction} from "./t.CrudAction"
import {TValidateUser} from "./t.Validate"

export type TRacl = {
  role: string;
  permissions: Array<string>
}

export type TRaclOptions = {
  type?: TValidateUser,
  action?: TCrudAction;
  jwtOnly?: boolean;
}
