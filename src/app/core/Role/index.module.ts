import {RoleService} from "./index.service";
import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {RoleController} from "./index.controller";
import {RoleRepository} from "./index.repository";
import {PermissionRepository} from "../Permission/index.repository";
import {PermissionService} from "../Permission/index.service";
import {PermissionModule} from "../Permission/index.module";
import {UserRepository} from "../User/index.repository";
import {UserModule} from "../User/index.module";
import {UserService} from "../User/index.service";

@Module({
  imports: [
    UserModule,
    PermissionModule,
    TypeOrmModule.forFeature(
      [
        RoleRepository,
        PermissionRepository,
        UserRepository
      ])
  ],
  controllers: [RoleController],
  providers: [RoleService, PermissionService, UserService]
})
export class RoleModule {}
