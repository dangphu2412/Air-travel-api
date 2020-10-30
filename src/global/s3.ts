import {S3, config} from "aws-sdk";
import {Injectable} from "@nestjs/common";
import {S3_CONFIG} from "src/common/constants";
import {TS3Config} from "src/common/type/t.s3";

@Injectable()
export class S3Service {
  private s3: S3;

  private timeout: number;

  private bucketName: string;

  constructor() {
    this.s3 = new S3();
    this.setS3Config();
  }

  private setS3Config() {
    const accessKeyId = S3_CONFIG.S3_ACCESS_KEY_ID;
    const secretAccessKey = S3_CONFIG.S3_SECRET_ACCESS_KEY;
    const region = S3_CONFIG.S3_REGION;
    const timeout = S3_CONFIG.S3_SIGNED_URL_TIMEOUT;
    const bucketName = S3_CONFIG.S3_BUCKET_NAME;

    config.update({
      accessKeyId,
      secretAccessKey,
      region
    });

    this.bucketName = bucketName;
    this.timeout = timeout;
  }

  getPresignedUrl(key: string, type: string) {
    const config: TS3Config = {
      Bucket: this.bucketName,
      Key: key,
      ContentType: type,
      ACL: "public-read",
      Expires: this.timeout
    }
    return this.s3.getSignedUrl("putObject", config);
  }
}
