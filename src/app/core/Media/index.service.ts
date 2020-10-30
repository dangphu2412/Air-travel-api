import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Media} from "src/common/entity";
import {MediaRepository} from "./index.repository";
import {parse} from "path";
import {SlugHelper} from "src/global/slugify";
import {S3Dto} from "src/common/dto/Media";
import {IS3Response} from "src/common/interface/i.s3";
import {S3Service} from "src/global/s3";
import moment from "moment";

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private repository: MediaRepository,
    private s3Service: S3Service
  ) {}

  private getKeyPresigned(folderPrefix: string, name: string, ext: string) {
    return `${folderPrefix}/${name}${ext}`
  }

  private getNameImage(name: string) {
    return `${SlugHelper.slugify(name) || "untitled"}-${moment().format("YYYYMMDDHHmmssSS")}`;
  }

  private getUrlFromPresigned(presignedUrl: string) {
    return presignedUrl.split("?")[0];
  }

  public getS3Response(dto: S3Dto): IS3Response {
    const presignedUrl = this.getPresignedUrl(dto);
    const response: IS3Response = {
      presignedUrl,
      url: this.getUrlFromPresigned(presignedUrl)
    }
    return response;
  }

  public getPresignedUrl(dto: S3Dto): string {
    const {type, fileName, folderPrefix} = dto;
    const ext = parse(fileName).ext;
    const name = this.getNameImage(parse(fileName).name);
    const key = this.getKeyPresigned(folderPrefix, name, ext);
    return this.s3Service.getPresignedUrl(key, type);
  }
}
