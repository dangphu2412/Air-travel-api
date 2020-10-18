import {TErrorBody, TErrorResponse} from "src/common/type/t.Error";

export const toError = (error: TErrorResponse): TErrorBody => {
  const body: TErrorBody = {
    statusCode: error.statusCode,
    message: [
      {
        code: error.error,
        description: error.message
      }
    ],
    error: error.message
  }
  return body;
}
