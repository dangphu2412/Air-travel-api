import {GrantAccess} from "src/common/decorators";
import {ApiBody, ApiOperation, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Post} from "@nestjs/common";
import {MediaService} from "./index.service";
import {S3Dto} from "src/common/dto/Media";
import {IS3Response} from "src/common/interface/i.s3";

@ApiTags("Medias")
@Controller("medias")
export class MediaController {
  constructor(public service: MediaService) {}

  @Post("presigned-url")
  @ApiOperation({summary: "Get presigned Url "})
  @GrantAccess({
    jwtOnly: true
  })
  getUrlStorage(@Body() s3Dto: S3Dto): IS3Response {
    return this.service.getS3Response(s3Dto);
  }

  @Post("presigned-url/bulk")
  @ApiOperation({summary: "Get presigned Url "})
  @ApiBody({type: () => S3Dto})
  @GrantAccess({
    jwtOnly: true
  })
  getUrlsStorage(@Body() s3Dtos: Array<S3Dto>) {
    return s3Dtos.map(dto => {
      return this.service.getS3Response(dto);
    });
  }
}
