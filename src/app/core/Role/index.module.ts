import {RoleService} from "./index.service";
import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {RoleController} from "./index.controller";
import {RoleRepository} from "./index.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleRepository])
  ],
  controllers: [RoleController],
  providers: [RoleService]
})
export class RoleModule {}
