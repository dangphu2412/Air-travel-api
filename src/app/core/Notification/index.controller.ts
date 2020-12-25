// import {GrantAccess} from "src/common/decorators";
import {ApiTags} from "@nestjs/swagger";
import {Body, Controller, Post} from "@nestjs/common";
import {NotificationService} from "./index.service";
import {NotificationContent} from "src/common/dto/Notify/notificationContent.dto";

@ApiTags("notifications")
@Controller("notifications")
export class NotificationController {
  constructor(public service: NotificationService) {}

  @Post("/test")
  testNotiAllCustomer(@Body() content: NotificationContent) {
    return this.service.sendAllTestCustomers(content);
  }
}
