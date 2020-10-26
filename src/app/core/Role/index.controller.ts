import {ApiTags} from "@nestjs/swagger";
import {Controller} from "@nestjs/common";
import {
  Action, Crud, CrudController, CrudRequest,
  Feature, Override, ParsedBody, ParsedRequest
} from "@nestjsx/crud";
import {RoleService} from "./index.service";
import {CreateRoleDto} from "src/common/dto/Role";
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
  },
  dto: {
    update: CreateRoleDto
  }
})
@Feature(ECrudFeature.ROLE)
@ApiTags("Roles")
@Controller("roles")
export class RoleController implements CrudController<Role> {
  constructor(public service: RoleService) {}

  @Action(ECrudAction.CREATE)
  @GrantAccess()
  @Override("createOneBase")
  createOneOverride(
    @ParsedBody() dto: CreateRoleDto,
    @CurrentUser() user: TJwtPayload
  ): Promise<Role> {
    return this.service.createRole(dto, user);
  };

  @Action(ECrudAction.UPDATE)
  @GrantAccess()
  @Override("updateOneBase")
  updateOneOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateRoleDto,
    @CurrentUser() user: TJwtPayload
  ): Promise<Role> {
    const id = req.parsed.paramsFilter[0].value;
    return this.service.updateRole(dto, user, id);
  };
}
