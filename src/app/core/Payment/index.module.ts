import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {BaseModule} from "src/app/base/base.module";
import {BaseService} from "src/app/base/base.service";
import {BillModule} from "../Bill/index.module";
import {BillRepository} from "../Bill/index.repository";
import {BillService} from "../Bill/index.service";
import {BillInfoModule} from "../BillInfo/index.module";
import {BillInfoRepository} from "../BillInfo/index.repository";
import {BillInfoService} from "../BillInfo/index.service";
import {CustomerModule} from "../Customer/index.module";
import {CustomerRepository} from "../Customer/index.repository";
import {CustomerService} from "../Customer/index.service";
import {ProviderModule} from "../Provider/index.module";
import {ProviderRepository} from "../Provider/index.repository";
import {ProviderService} from "../Provider/index.service";
import {UserModule} from "../User/index.module";
import {UserRepository} from "../User/index.repository";
import {UserService} from "../User/index.service";
import {PaymentController} from "./index.controller";
import {PaymentRepository} from "./index.repository";
import {PaymentService} from "./index.service";


@Module({
  imports: [
    BaseModule,
    BillModule,
    BillInfoModule,
    CustomerModule,
    ProviderModule,
    UserModule,
    TypeOrmModule.forFeature([
      PaymentRepository,
      BillRepository,
      BillInfoRepository,
      CustomerRepository,
      ProviderRepository,
      UserRepository
    ])
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    BaseService,
    BillService,
    BillInfoService,
    CustomerService,
    ProviderService,
    UserService
  ],
  exports: [PaymentService]
})
export class PaymentModule {}
