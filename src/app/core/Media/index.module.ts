import {MediaService} from "./index.service";
import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {MediaController} from "./index.controller";
import {MediaRepository} from "./index.repository";
import {S3Service} from "src/global/s3";

@Module({
  imports: [
    TypeOrmModule.forFeature([MediaRepository])
  ],
  controllers: [MediaController],
  providers: [MediaService, S3Service]
})
export class MediaModule {}
