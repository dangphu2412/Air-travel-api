import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {Controller, Get} from "@nestjs/common";
import {PermissionService} from "./index.service";
import {GrantAccess} from "src/common/decorators";
import {Feature} from "@nestjsx/crud";
import {ECrudFeature} from "src/common/enums";

@Feature(ECrudFeature.PERMISSIONS)
@ApiTags("Permissions")
@Controller("permissions")
export class PermissionController {
  constructor(public service: PermissionService) {}

  @GrantAccess({
    action: "READ"
  })
  @ApiOperation({
    summary: "Fetch all permissions"
  })
  @Get("/")
  getAll() {
    return this.service.getAll();
  }
}
