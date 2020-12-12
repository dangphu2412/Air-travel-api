import {CustomerService} from "./index.service";
import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CustomerController} from "./index.controller";
import {CustomerRepository} from "./index.repository";
import {BaseService} from "src/app/base/base.service";
import {BaseModule} from "src/app/base/base.module";
import {UserModule} from "../User/index.module";
import {UserRepository} from "../User/index.repository";
import {UserService} from "../User/index.service";
import {NotificationRepository} from "../Notification/index.repository";
import {NotificationModule} from "../Notification/index.module";
import {NotificationService} from "../Notification/index.service";

@Module({
  imports: [
    BaseModule,
    UserModule,
    NotificationModule,
    TypeOrmModule.forFeature([
      CustomerRepository,
      UserRepository,
      NotificationRepository
    ])
  ],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    BaseService,
    UserService,
    NotificationService
  ],
  exports: [CustomerService]
})
export class CustomerModule {}
