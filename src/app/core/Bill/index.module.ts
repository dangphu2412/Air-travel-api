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

@Module({
  imports: [
    BaseModule,
    UserModule,
    TypeOrmModule.forFeature([
      BillRepository,
      UserRepository
    ])
  ],
  controllers: [BillController],
  providers: [
    BillService,
    BaseService,
    UserService
  ],
  exports: [BillService]
})
export class BillModule {}
