import {ApiTags} from "@nestjs/swagger";
import {
  Controller, Patch, Param, ParseIntPipe,
  Get, UseInterceptors, Delete
} from "@nestjs/common";
import {
  Crud, CrudController, Feature,
  ParsedRequest, CrudRequest, CrudRequestInterceptor, Override, ParsedBody
} from "@nestjsx/crud";
import {User} from "src/common/entity";
import {UserService} from "./index.service";
import {CurrentUser} from "src/common/decorators";
import {GrantAccess} from "src/common/decorators";
import {ECrudAction, ECrudFeature} from "src/common/enums";
import {SqlInterceptor} from "src/common/interceptors/sql.interceptor";
import {CrudSwaggerFindMany} from "src/common/decorators/crudSwagger.decorator";

@Crud({
  model: {
    type: User
  },
  query: {
    exclude: ["password", "hasExpiredToken"],
    join: {
      "role": {
        exclude: ["createdAt", "updatedAt", "deletedAt"],
        eager: true
      },
      "role.permissions": {
        exclude: ["createdAt", "updatedAt", "deletedAt"],
        eager: true
      }
    }
  },
  routes: {
    exclude: ["createManyBase", "replaceOneBase"],
    getManyBase: {
      decorators: [
        GrantAccess({
          action: ECrudAction.READ
        })
      ]
    },
    getOneBase: {
      decorators: [
        GrantAccess({
          action: ECrudAction.READ
        })
      ]
    }
  }
})
@ApiTags("Users")
@Feature(ECrudFeature.USER)
@Controller("users")
export class UserController implements CrudController<User> {
  constructor(public service: UserService) {}

  get base(): CrudController<User> {
    return this;
  }

  @UseInterceptors(SqlInterceptor)
  @GrantAccess({
    action: ECrudAction.CREATE
  })
  @Override("createOneBase")
  async createOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: User,
  ): Promise<User> {
    await this.service.mapRelationKeysToEntities(dto);
    return this.base.createOneBase(req, dto);
  };

  @UseInterceptors(SqlInterceptor)
  @GrantAccess({
    action: ECrudAction.UPDATE
  })
  @Override("updateOneBase")
  async updateOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: User,
  ): Promise<User> {
    await this.service.mapRelationKeysToEntities(dto);
    return this.base.updateOneBase(req, dto);
  };

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

  @CrudSwaggerFindMany()
  @Override("deleteOneBase")
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
