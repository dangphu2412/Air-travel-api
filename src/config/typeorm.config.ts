import {TypeOrmModuleOptions} from "@nestjs/typeorm";
import env from "dotenv";
import {DB_URI, DB_LOGGING, ENV} from "src/env";

env.config({path: ".env"});
export const typeOrmConfig: TypeOrmModuleOptions = {
  url: DB_URI,
  type: "postgres",
  synchronize: false,
  logging: DB_LOGGING,
  entities: ["dist/**/*.entity{.ts,.js}"],
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: ENV === "production"
    }
  }
};
