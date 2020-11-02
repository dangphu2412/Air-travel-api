import {DestinationService} from "./index.service";
import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {DestinationController} from "./index.controller";
import {DestinationRepository} from "./index.repository";
import {CityModule} from "../City/index.module";
import {DistrictModule} from "../District/index.module";
import {CityService} from "../City/index.service";
import {DistrictService} from "../District/index.service";
import {CityRepository} from "../City/index.repository";
import {DistrictRepository} from "../District/index.repository";
import {UserModule} from "../User/index.module";
import {UserRepository} from "../User/index.repository";
import {BaseService} from "src/app/base/base.service";
import {BaseModule} from "src/app/base/base.module";

@Module({
  imports: [
    CityModule,
    DistrictModule,
    UserModule,
    BaseModule,
    TypeOrmModule.forFeature([
      DestinationRepository,
      CityRepository,
      DistrictRepository,
      UserRepository
    ])
  ],
  controllers: [DestinationController],
  providers: [
    DestinationService, CityService,
    DistrictService,
    BaseService
  ],
  exports: [DestinationService]
})
export class DestinationModule {}
