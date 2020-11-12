import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {BillServiceController} from "./index.controller";
import {BillServiceRepository} from "./index.repository";
import {BillServiceService} from "./index.service";


@Module({
  imports: [
    TypeOrmModule.forFeature([
      BillServiceRepository
    ])
  ],
  controllers: [BillServiceController],
  providers: [
    BillServiceService
  ],
  exports: [BillServiceService]
})
export class BillServiceModule {}
