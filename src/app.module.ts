import {PermissionModule} from "./app/core/Permission/index.module";
import {RoleModule} from "./app/core/Role/index.module";
import {UserModule} from "./app/core/User/index.module";
import {AuthModule} from "./app/core/Auth/index.module";
import {Module} from "@nestjs/common";
import {typeOrmConfig} from "./config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ServiceModule} from "./app/core/Service/index.module";
import {DestinationModule} from "./app/core/Destination/index.module";
import {CityModule} from "./app/core/City/index.module";
import {DistrictModule} from "./app/core/District/index.module";
import {BaseModule} from "./app/base/index.module";
import {MediaModule} from "./app/core/Media/index.module";

@Module({
  imports: [
    AuthModule,
    UserModule,
    BaseModule,
    RoleModule,
    PermissionModule,
    ServiceModule,
    DestinationModule,
    CityModule,
    DistrictModule,
    MediaModule,
    TypeOrmModule.forRoot(typeOrmConfig)
  ]
})
export class AppModule {}
