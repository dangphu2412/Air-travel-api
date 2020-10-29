import {ApiTags} from "@nestjs/swagger";
import {Controller, Delete, Get, Param, ParseIntPipe, Patch, UseInterceptors} from "@nestjs/common";
import {
  Action, Crud, CrudController, CrudRequest,
  CrudRequestInterceptor,
  Feature, Override, ParsedBody, ParsedRequest
} from "@nestjsx/crud";
import {RoleService} from "./index.service";
import {Role, User} from "src/common/entity";
import {CurrentUser, GrantAccess} from "src/common/decorators";
import {ECrudAction, ECrudFeature} from "src/common/enums";

@Crud({
  model: {
    type: Role
  },
  routes: {
    exclude: ["replaceOneBase", "createManyBase"],
    getManyBase: {
      decorators: [Action(ECrudAction.READ), GrantAccess()]
    },
    getOneBase: {
      decorators: [Action(ECrudAction.READ), GrantAccess()]
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

  @Action(ECrudAction.CREATE)
  @GrantAccess()
  @Override("createOneBase")
  async createOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Role,
    @CurrentUser() user: User
  ): Promise<Role> {
    await this.service.authAdmin(user);
    await this.service.mapRelationKeysToEntities(dto);
    return this.base.createOneBase(req, dto);
  };

  @Action(ECrudAction.UPDATE)
  @GrantAccess()
  @Override("updateOneBase")
  async updateOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Role,
    @CurrentUser() user: User
  ): Promise<Role> {
    await this.service.authAdmin(user);
    await this.service.mapRelationKeysToEntities(dto);
    return this.base.updateOneBase(req, dto);
  };

  @Patch(":id/restore")
  @Action(ECrudAction.RESTORE)
  @GrantAccess()
  async restoreDestination(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: User
  ) {
    await this.service.authAdmin(user);
    return this.service.restore(id);
  }

  @UseInterceptors(CrudRequestInterceptor)
  @Get("trashed")
  getDeleted(@ParsedRequest() req: CrudRequest) {
    return this.service.getDeleted(req);
  }

  @Override("deleteOneBase")
  @Delete(":id")
  @Action(ECrudAction.SOFT_DEL)
  @GrantAccess()
  async softDelete(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: User
  ) {
    await this.service.authAdmin(user);
    return this.service.softDelete(id);
  }
}
