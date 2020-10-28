
import {
  Injectable, NestInterceptor, ExecutionContext,
  CallHandler, ConflictException
} from "@nestjs/common";
import {Observable, throwError} from "rxjs";
import {catchError, timeout} from "rxjs/operators";
import {DEFAULT_ERROR, SQL_ERROR_CODE} from "../constants";
import {ErrorCodeEnum} from "../enums";

@Injectable()
export class SqlInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(10000),
      catchError(err => {
        let finalError: any = err;
        switch (err.code) {
          case SQL_ERROR_CODE.VIOLATE_CONSTAINT:
            finalError = new ConflictException(
              DEFAULT_ERROR.ConflictUnique,
              ErrorCodeEnum.VIOLATE_FOREIGN_KEY_CONSTRAINT
            )
            break;
          case SQL_ERROR_CODE.ALREADY_EXIST:
            finalError = new ConflictException(
              DEFAULT_ERROR.ConflictExisted,
              ErrorCodeEnum.ALREADY_EXIST
            )
          default:
            break;
        }
        return throwError(finalError);
      }),
    );
  };
};
