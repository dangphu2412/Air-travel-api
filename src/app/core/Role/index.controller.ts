import {ApiTags} from "@nestjs/swagger";
import {Controller} from "@nestjs/common";
import {
  Action, Crud, CrudController, CrudRequest,
  Feature, Override, ParsedBody, ParsedRequest
} from "@nestjsx/crud";
import {RoleService} from "./index.service";
import {Role} from "src/common/entity";
import {CurrentUser, GrantAccess} from "src/common/decorators";
import {TJwtPayload} from "src/common/type";
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
    @CurrentUser() user: TJwtPayload
  ): Promise<Role> {
    await this.service.authAdmin(dto, user);
    await this.service.mapRelationKeysToEntities(dto);
    return this.base.createOneBase(req, dto);
  };

  @Action(ECrudAction.UPDATE)
  @GrantAccess()
  @Override("updateOneBase")
  async updateOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Role,
    @CurrentUser() user: TJwtPayload
  ): Promise<Role> {
    await this.service.authAdmin(dto, user);
    await this.service.mapRelationKeysToEntities(dto);
    return this.base.updateOneBase(req, dto);
  };
}
