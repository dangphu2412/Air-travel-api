import {TypeOrmModuleOptions} from "@nestjs/typeorm";
import env from "dotenv";
import {DB_URI, DB_LOGGING} from "src/env";

env.config({path: ".env"});
export const typeOrmConfig: TypeOrmModuleOptions = {
  url: DB_URI,
  type: "postgres",
  synchronize: false,
  logging: DB_LOGGING,
  entities: ["dist/**/*.entity{.ts,.js}"]
};
