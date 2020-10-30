import {TCrudAction} from "./t.CrudAction"

export type TRacl = {
  role: string;
  permissions: Array<string>
}

export type TRaclOptions = {
  action?: TCrudAction;
  jwtOnly?: boolean;
}
