import {RoleService} from "./index.service";
import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {RoleController} from "./index.controller";
import {RoleRepository} from "./index.repository";
import {PermissionRepository} from "../Permission/index.repository";
import {PermissionService} from "../Permission/index.service";
import {PermissionModule} from "../Permission/index.module";
import {BaseService} from "src/app/base/base.service";
import {BaseModule} from "src/app/base/base.module";
import {UserModule} from "../User/index.module";
import {UserRepository} from "../User/index.repository";
import {UserService} from "../User/index.service";

@Module({
  imports: [
    PermissionModule,
    BaseModule,
    UserModule,
    TypeOrmModule.forFeature(
      [
        UserRepository,
        RoleRepository,
        PermissionRepository
      ])
  ],
  controllers: [RoleController],
  providers: [
    RoleService, PermissionService,
    BaseService, UserService
  ],
  exports: [
    RoleService
  ]
})
export class RoleModule {}
