import {ApiTags} from "@nestjs/swagger";
import {Controller, Patch, Param, ParseIntPipe, Get, UseInterceptors, Delete} from "@nestjs/common";
import {
  Crud, CrudController, Feature,
  ParsedRequest, CrudRequest, CrudRequestInterceptor, Override, ParsedBody
} from "@nestjsx/crud";
import {User} from "src/common/entity";
import {UserService} from "./index.service";
import {CurrentUser} from "src/common/decorators";
import {GrantAccess} from "src/common/decorators";
import {ECrudAction, ECrudFeature} from "src/common/enums";
import {RegisterDto} from "src/common/dto/User";

@Crud({
  model: {
    type: User
  },
  query: {
    exclude: ["password"]
  },
  routes: {
    exclude: ["createManyBase", "replaceOneBase"]
  }
})
@ApiTags("Users")
@Feature(ECrudFeature.USER)
@Controller("users")
export class UserController implements CrudController<User> {
  constructor(public service: UserService) {}

  @Override()
  createOne(
    @ParsedBody() dto: RegisterDto,
  ) {
    return this.service.createOneBase(dto);
  }

  @Patch("/:id/restore")
  @GrantAccess({
    action: ECrudAction.RESTORE
  })
  restoreUser(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: User
  ) {
    return this.service.restore(id, user);
  }

  @UseInterceptors(CrudRequestInterceptor)
  @Get("/trashed")
  getDeleted(@ParsedRequest() req: CrudRequest) {
    return this.service.getDeleted(req);
  }

  @Delete("/:id")
  @GrantAccess({
    action: ECrudAction.SOFT_DEL
  })
  softDelete(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: User
  ) {
    return this.service.softDelete(id, user);
  }
}
