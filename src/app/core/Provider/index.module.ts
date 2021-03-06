import {ProviderService} from "./index.service";
import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProviderController} from "./index.controller";
import {ProviderRepository} from "./index.repository";
import {UserRepository} from "../User/index.repository";
import {UserModule} from "../User/index.module";
import {UserService} from "../User/index.service";
import {BaseModule} from "src/app/base/base.module";
import {BaseService} from "src/app/base/base.service";

@Module({
  imports: [
    UserModule,
    BaseModule,
    TypeOrmModule.forFeature([
      ProviderRepository,
      UserRepository
    ])
  ],
  controllers: [ProviderController],
  providers: [ProviderService, UserService, BaseService],
  exports: [ProviderService]
})
export class ProviderModule {}
