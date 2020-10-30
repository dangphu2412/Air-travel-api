export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET,
  EXPIRE: process.env.JWT_EXPIRES
}

export const S3_CONFIG = {
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
  S3_REGION: process.env.S3_REGION,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
  S3_SIGNED_URL_TIMEOUT: parseInt(process.env.S3_SIGNED_URL_TIMEOUT, 10)
}
