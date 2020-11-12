import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import { BaseModule } from "src/app/base/base.module";
import { BaseService } from "src/app/base/base.service";
import { CustomerModule } from "../Customer/index.module";
import { CustomerRepository } from "../Customer/index.repository";
import { CustomerService } from "../Customer/index.service";
import { ProviderModule } from "../Provider/index.module";
import { ProviderRepository } from "../Provider/index.repository";
import { ProviderService } from "../Provider/index.service";
import { UserModule } from "../User/index.module";
import { UserRepository } from "../User/index.repository";
import { UserService } from "../User/index.service";
import {BillInfoController} from "./index.controller";
import {BillInfoRepository} from "./index.repository";
import {BillInfoService} from "./index.service";


@Module({
  imports: [
    CustomerModule,
    ProviderModule,
    BaseModule,
    UserModule,
    ProviderModule,
    TypeOrmModule.forFeature([
      BillInfoRepository,
      CustomerRepository,
      ProviderRepository,
      UserRepository
    ])
  ],
  controllers: [BillInfoController],
  providers: [
    BillInfoService,
    ProviderService,
    CustomerService,
    BaseService,
    UserService,
    ProviderService
  ],
  exports: [BillInfoService]
})
export class BillInfoModule {}
