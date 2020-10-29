import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {Controller, Get} from "@nestjs/common";
import {PermissionService} from "./index.service";

@ApiTags("Permissions")
@Controller("permissions")
export class PermissionController {
  constructor(public service: PermissionService) {}

  @ApiOperation({
    description: "Fetch all permissions"
  })
  @Get("/")
  getAll() {
    return this.service.getAll();
  }
}
