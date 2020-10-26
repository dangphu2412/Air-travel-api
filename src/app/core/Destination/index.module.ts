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

@Module({
  imports: [
    CityModule,
    DistrictModule,
    TypeOrmModule.forFeature([
      DestinationRepository,
      CityRepository,
      DistrictRepository
    ])
  ],
  controllers: [DestinationController],
  providers: [DestinationService, CityService, DistrictService],
  exports: [DestinationService]
})
export class DestinationModule {}
