import {CityService} from "./index.service";
import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CityController} from "./index.controller";
import {CityRepository} from "./index.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([CityRepository])
  ],
  controllers: [CityController],
  providers: [CityService],
  exports: [CityService]
})
export class CityModule {}
