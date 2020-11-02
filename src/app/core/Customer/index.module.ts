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

@Module({
  imports: [
    BaseModule,
    UserModule,
    TypeOrmModule.forFeature([
      CustomerRepository,
      UserRepository
    ])
  ],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    BaseService,
    UserService
  ],
  exports: [CustomerService]
})
export class CustomerModule {}
