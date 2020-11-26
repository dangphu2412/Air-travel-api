import {NotificationService} from "./index.service";
import {Module} from "@nestjs/common";
import {NotificationController} from "./index.controller";

@Module({
  imports: [],
  controllers: [NotificationController],
  providers: [NotificationService]
})
export class NotificationModule {}
