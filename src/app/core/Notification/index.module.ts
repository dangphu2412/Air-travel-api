import {NotificationService} from "./index.service";
import {Module} from "@nestjs/common";
import {NotificationController} from "./index.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {NotificationRepository} from "./index.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotificationRepository
    ])
  ],
  controllers: [NotificationController],
  providers: [NotificationService]
})
export class NotificationModule {}
