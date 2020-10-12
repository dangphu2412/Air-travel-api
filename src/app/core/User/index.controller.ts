import {ApiTags} from "@nestjs/swagger";
import {Controller, Patch, Param, ParseIntPipe, Get, UseInterceptors, Delete} from "@nestjs/common";
import {
  Crud, CrudController, Feature, Action,
  ParsedRequest, CrudRequest, CrudRequestInterceptor
} from "@nestjsx/crud";
import {UpsertUserDto} from "src/common/dto/User/upsert.dto";
import {User} from "src/common/entity";
import {UserService} from "./index.service";
import {CurrentUser} from "src/common/decorators";
import {GrantAccess} from "src/common/decorators";
import {ECrudAction, ECrudFeature} from "src/common/enums";

@Crud({
  model: {
    type: User
  },
  query: {
    exclude: ["password"]
  },
  dto: {
    create: UpsertUserDto,
    update: UpsertUserDto,
    replace: UpsertUserDto
  },
  routes: {
    exclude: ["createManyBase"]
  }
})
@ApiTags("Users")
@Feature(ECrudFeature.USER)
@Controller("users")
export class UserController implements CrudController<User> {
  constructor(public service: UserService) {}

  @Patch("/restore/:id")
  @Action(ECrudAction.RESTORE)
  @GrantAccess()
  restoreUser(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: User
  ) {
    return this.service.restore(id, user);
  }

  @UseInterceptors(CrudRequestInterceptor)
  @Get("/deleted")
  getDeleted(@ParsedRequest() req: CrudRequest) {
    return this.service.getDeleted(req);
  }

  @Delete("/soft/:id")
  @Action(ECrudAction.SOFT_DEL)
  @GrantAccess("ADMIN", "SUPER_ADMIN")
  softDelete(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: User
  ) {
    return this.service.softDelete(id, user);
  }
}
