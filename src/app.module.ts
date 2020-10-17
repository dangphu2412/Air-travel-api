import {PermissionModule} from "./app/core/Permission/index.module";
import {RoleModule} from "./app/core/Role/index.module";
import {UserModule} from "./app/core/User/index.module";
import {AuthModule} from "./app/core/Auth/index.module";
import {Module} from "@nestjs/common";
import {typeOrmConfig} from "./config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ServiceModule} from "./app/core/Service/index.module";

@Module({
  imports: [
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    ServiceModule,
    TypeOrmModule.forRoot(typeOrmConfig)
  ]
})
export class AppModule {}
