// import {GrantAccess} from "src/common/decorators";
import {ApiTags} from "@nestjs/swagger";
import {Controller} from "@nestjs/common";
import {NotificationService} from "./index.service";

@ApiTags("notifications")
@Controller("notifications")
export class NotificationController {
  constructor(public service: NotificationService) {}
}
