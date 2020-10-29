import {CityModule} from "../City/index.module";
import {ServiceService} from "./index.service";
import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ServiceController} from "./index.controller";
import {ServiceRepository} from "./index.repository";
import {UserRepository} from "../User/index.repository";
import {UserModule} from "../User/index.module";
import {ServiceCategoryRepository} from "../ServiceCategory/index.repository";
import {ProviderRepository} from "../Provider/index.repository";
import {ServiceCategoryModule} from "../ServiceCategory/index.module";
import {ProviderModule} from "../Provider/index.module";
import {ProviderService} from "../Provider/index.service";
import {ServiceCategoryService} from "../ServiceCategory/index.service";
import {DestinationModule} from "../Destination/index.module";
import {DestinationRepository} from "../Destination/index.repository";
import {DestinationService} from "../Destination/index.service";
import {DistrictModule} from "../District/index.module";
import {DistrictRepository} from "../District/index.repository";
import {CityRepository} from "../City/index.repository";
import {BaseModule} from "src/app/base/index.module";

@Module({
  imports: [
    UserModule,
    BaseModule,
    ServiceCategoryModule,
    ProviderModule,
    DestinationModule,
    CityModule,
    DistrictModule,
    TypeOrmModule.forFeature([
      ServiceRepository,
      UserRepository,
      ServiceCategoryRepository,
      ProviderRepository,
      DestinationRepository,
      DistrictRepository,
      CityRepository
    ])
  ],
  controllers: [ServiceController],
  providers: [
    ServiceService, ServiceCategoryService,
    ProviderService, DestinationService, BaseModule
  ],
  exports: [ServiceService]
})
export class ServiceModule {}
