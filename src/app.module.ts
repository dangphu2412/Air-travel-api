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
import {MediaModule} from "./app/core/Media/index.module";
import {CustomerModule} from "./app/core/Customer/index.module";
import {ServiceCategoryModule} from "./app/core/ServiceCategory/index.module";
import {ProviderModule} from "./app/core/Provider/index.module";
import {BillModule} from "./app/core/Bill/index.module";
import {BillServiceModule} from "./app/core/BillService/index.module";
import {PaymentModule} from "./app/core/Payment/index.module";
import {BillInfoModule} from "./app/core/BillInfo/index.module";

@Module({
  imports: [
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    ServiceModule,
    ServiceCategoryModule,
    ProviderModule,
    DestinationModule,
    CityModule,
    DistrictModule,
    MediaModule,
    CustomerModule,
    BillModule,
    BillServiceModule,
    PaymentModule,
    BillInfoModule,
    TypeOrmModule.forRoot(typeOrmConfig)
  ]
})
export class AppModule {}
