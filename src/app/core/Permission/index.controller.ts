import {ApiTags} from "@nestjs/swagger";
import {Controller, Get} from "@nestjs/common";
import {PermissionService} from "./index.service";

@ApiTags("Permissions")
@Controller("permissions")
export class PermissionController {
  constructor(public service: PermissionService) {}

  @Get("/")
  getAll() {
    return this.service.getAll();
  }
}
