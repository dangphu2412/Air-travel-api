import {BillService} from "./index.service";
import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {BillController} from "./index.controller";
import {BillRepository} from "./index.repository";
import {BaseService} from "src/app/base/base.service";
import {BaseModule} from "src/app/base/base.module";
import {UserModule} from "../User/index.module";
import {UserRepository} from "../User/index.repository";
import {UserService} from "../User/index.service";
import {CustomerModule} from "../Customer/index.module";
import {CustomerRepository} from "../Customer/index.repository";
import {CustomerService} from "../Customer/index.service";
import {NotificationRepository} from "../Notification/index.repository";
import {NotificationModule} from "../Notification/index.module";

@Module({
  imports: [
    BaseModule,
    UserModule,
    CustomerModule,
    NotificationModule,
    UserModule,
    TypeOrmModule.forFeature([
      BillRepository,
      UserRepository,
      CustomerRepository,
      NotificationRepository,
      UserRepository
    ])
  ],
  controllers: [BillController],
  providers: [
    BillService,
    BaseService,
    UserService,
    CustomerService,
    UserService
  ],
  exports: [BillService]
})
export class BillModule {}
