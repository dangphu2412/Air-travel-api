
import {
  Injectable, NestInterceptor, ExecutionContext,
  CallHandler, RequestTimeoutException
} from "@nestjs/common";
import {Observable, throwError, TimeoutError} from "rxjs";
import {catchError, timeout} from "rxjs/operators";

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const TIMEOUT_PER_API = 10000;

    /**
     * Intercept timeout via pipe
     */
    return next.handle().pipe(
      timeout(TIMEOUT_PER_API),
      catchError(err => {
        if (err instanceof TimeoutError) {
          return throwError(new RequestTimeoutException());
        }
        return throwError(err);
      }),
    );
  };
};
