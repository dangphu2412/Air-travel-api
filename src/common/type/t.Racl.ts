export type TRacl = {
  role: string;
  permissions: Array<string>
}

export type TRaclOptions = {
  jwtOnly: boolean;
}
