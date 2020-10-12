import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {User} from "../entity";

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext): User => {
    const user: User = ctx.switchToHttp().getRequest().user;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);
