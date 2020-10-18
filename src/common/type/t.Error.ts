export type TErrorMessage = {
  code: string;
  description: string;
}
export type TErrorBody = {
  statusCode: number;
  message: TErrorMessage[];
  error ?: string;
}

export type TErrorResponse = {
  statusCode: number;
  message: string;
  error ?: string;
}
