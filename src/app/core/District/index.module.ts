import {DistrictService} from "./index.service";
import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {DistrictController} from "./index.controller";
import {DistrictRepository} from "./index.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([DistrictRepository])
  ],
  controllers: [DistrictController],
  providers: [DistrictService],
  exports: [DistrictService]
})
export class DistrictModule {}
