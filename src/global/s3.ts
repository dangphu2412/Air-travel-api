import AWS, {S3 as AwsS3} from "aws-sdk";
import {Injectable} from "@nestjs/common";
import {S3_CONFIG} from "src/env";

@Injectable()
export class S3Service {
  public s3: AwsS3;

  public bucket: string;

  public signedUrlExpireSeconds: number;

  constructor() {
    const accessKeyId = S3_CONFIG.S3_ACCESS_KEY_ID;
    const secretAccessKey = S3_CONFIG.S3_SECRET_ACCESS_KEY;
    const region = S3_CONFIG.S3_REGION;

    AWS.config.update({
      accessKeyId,
      secretAccessKey,
      region
    });
    this.s3 = new AWS.S3();

    this.bucket = process.env.S3_BUCKET_NAME;
    this.signedUrlExpireSeconds = parseInt(process.env.S3_SIGNED_URL_TIMEOUT, 10);
  }

  getPresignedUrl(key: string, type: string): string {
    return this.s3.getSignedUrl("putObject", {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: type,
      ACL: "public-read",
      Expires: this.signedUrlExpireSeconds
    });
  }
}
