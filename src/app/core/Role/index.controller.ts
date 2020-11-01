import {ApiTags} from "@nestjs/swagger";
import {Controller, Delete, Get, Param, ParseIntPipe, Patch, UseInterceptors} from "@nestjs/common";
import {
  Crud, CrudController, CrudRequest,
  CrudRequestInterceptor,
  Feature, Override, ParsedBody, ParsedRequest
} from "@nestjsx/crud";
import {RoleService} from "./index.service";
import {Role, User} from "src/common/entity";
import {CurrentUser, GrantAccess} from "src/common/decorators";
import {ECrudAction, ECrudFeature} from "src/common/enums";
import {SqlInterceptor} from "src/common/interceptors/sql.interceptor";

@Crud({
  model: {
    type: Role
  },
  routes: {
    exclude: ["replaceOneBase", "createManyBase"],
    getManyBase: {
      decorators: [GrantAccess({action: ECrudAction.READ})]
    },
    getOneBase: {
      decorators: [GrantAccess({action: ECrudAction.READ})]
    }
  },
  query: {
    join: {
      permissions: {
        allow: ["id", "name"],
        eager: true
      }
    }
  }
})
@Feature(ECrudFeature.ROLE)
@ApiTags("Roles")
@Controller("roles")
export class RoleController implements CrudController<Role> {
  constructor(public service: RoleService) {}

  get base(): CrudController<Role> {
    return this;
  }

  @GrantAccess({
    action: ECrudAction.CREATE
  })
  @UseInterceptors(SqlInterceptor)
  @Override("createOneBase")
  async createOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Role,
    @CurrentUser() user: User
  ): Promise<Role> {
    await this.service.mapRelationKeysToEntities(dto, user);
    return this.base.createOneBase(req, dto);
  };

  @GrantAccess({
    action: ECrudAction.UPDATE
  })
  @UseInterceptors(SqlInterceptor)
  @Override("updateOneBase")
  async updateOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Role,
    @CurrentUser() user: User
  ): Promise<Role> {
    await this.service.mapRelationKeysToEntities(dto, user);
    return this.base.updateOneBase(req, dto);
  };

  @Patch(":id/restore")
  @GrantAccess({action: ECrudAction.RESTORE})
  async restoreDestination(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: User
  ) {
    return this.service.restore(id, user);
  }

  @UseInterceptors(CrudRequestInterceptor)
  @Get("trashed")
  getDeleted(@ParsedRequest() req: CrudRequest) {
    return this.service.getDeleted(req);
  }

  @Override("deleteOneBase")
  @Delete(":id")
  @GrantAccess({action: ECrudAction.SOFT_DEL})
  async softDelete(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: User
  ) {
    return this.service.softDelete(id, user);
  }
}
