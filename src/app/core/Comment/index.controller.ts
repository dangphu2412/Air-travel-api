
import {ApiTags} from "@nestjs/swagger";
import {Body, Controller} from "@nestjs/common";
import {
  Crud, CrudController, CrudRequest, Feature, Override, ParsedRequest
} from "@nestjsx/crud";
import {Comment, Customer} from "src/common/entity";
import {CommentService} from "./index.service";
import {ECrudFeature} from "src/common/enums";
import {GrantAccess, CurrentUser} from "src/common/decorators";
import {SqlInterceptor} from "src/common/interceptors/sql.interceptor";

@Crud({
  model: {
    type: Comment
  },
  routes: {
    only: ["getManyBase", "getOneBase", "createOneBase"],
    createOneBase: {
      decorators: [
        GrantAccess({
          jwtOnly: true
        })
      ],
      interceptors: [SqlInterceptor]
    }
  },
  query: {
    join: {
      customer: {
        eager: true
      }
    }
  }
})
@ApiTags("Comments")
@Feature(ECrudFeature.BILL_SERVICE)
@Controller("payments")
export class CommentController implements CrudController<Comment> {
  constructor(public service: CommentService) {}

  get base(): CrudController<Comment> {
    return this;
  }

  @Override("createOneBase")
  createOne(
    @ParsedRequest() req: CrudRequest,
    @Body() dto: Comment,
    @CurrentUser() user: Customer
  ) {
    this.service.validateAuthor(user);
    return this.base.createOneBase(req, dto)
  }
}
