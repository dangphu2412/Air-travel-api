export type TS3Config = {
  Bucket: string,
  Key: string,
  ContentType: string,
  ACL: "public-read" | "read",
  Expires: number
}
