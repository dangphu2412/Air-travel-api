import {Crud} from "@nestjsx/crud";
import {ApiTags} from "@nestjs/swagger";
import {Controller} from "@nestjs/common";
import {PermissionService} from "./index.service";
import {Permission} from "src/common/entity";

@Crud({
  model: {
    type: Permission
  },
  routes: {
    exclude: ["createManyBase"]
  }
})
@ApiTags("Permissions")
@Controller("permissions")
export class PermissionController {
  constructor(public service: PermissionService) {}
}
