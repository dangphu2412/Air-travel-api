import env from "dotenv";

env.config();

export const ENV = process.env.NODE_ENV || "development";

export const DB_URI = process.env.DB_URI;
export const DB_LOGGING = process.env.NODE_ENV === "production" ? false : true;

export const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;

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

export const FIREBASE_CONFIG = {
  DATABASE_FIREBASE_URL: process.env.DATABASE_FIREBASE_URL,
  PROJECT_ID: process.env.PROJECT_ID,
  SERVICE_ACCOUNT: process.env.SERVICE_ACCOUNT
}
