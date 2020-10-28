import {ServiceCategoryService} from "./index.service";
import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ServiceCategoryController} from "./index.controller";
import {ServiceCategoryRepository} from "./index.repository";
import {UserRepository} from "../User/index.repository";
import {UserModule} from "../User/index.module";
import {UserService} from "../User/index.service";

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      ServiceCategoryRepository,
      UserRepository
    ])
  ],
  controllers: [ServiceCategoryController],
  providers: [ServiceCategoryService, UserService],
  exports: [ServiceCategoryService]
})
export class ServiceCategoryModule {}
