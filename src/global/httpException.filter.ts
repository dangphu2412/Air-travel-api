import {ExceptionFilter, Catch, ArgumentsHost, HttpException} from "@nestjs/common";
import {Response} from "express";
import {TErrorResponse, TErrorBody} from "src/common/type/t.Error";
import {toError} from "src/utils";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse() as TErrorResponse;
    const error: TErrorBody = toError(errorResponse);
    response
      .status(status)
      .json(error);
  }
}
