import {ServiceService} from "./index.service";
import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ServiceController} from "./index.controller";
import {ServiceRepository} from "./index.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceRepository])
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService]
})
export class ServiceModule {}
