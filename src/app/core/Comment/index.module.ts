import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {BaseModule} from "src/app/base/base.module";
import {BaseService} from "src/app/base/base.service";
import {CommentController} from "./index.controller";
import {CommentRepository} from "./index.repository";
import {CommentService} from "./index.service";


@Module({
  imports: [
    BaseModule,
    TypeOrmModule.forFeature([
      CommentRepository
    ])
  ],
  controllers: [CommentController],
  providers: [
    CommentService,
    BaseService
  ],
  exports: [CommentService]
})
export class CommentModule {}
