type TPermissionRacl = {
  method: string;
  module: string;
}

export type TRacl = {
  role: string;
  permissions: Array<TPermissionRacl>
}