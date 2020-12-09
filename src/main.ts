import {NestFactory} from "@nestjs/core";
import "./config/crud.config";
import {AppModule} from "./app.module";
import {BundleApp} from "./config/bundle";
import * as env from "dotenv";

env.config();

async function bootstrap() {
  /**
   * App Config
   */
  const app = await NestFactory.create(AppModule, {
    cors: true
  });

  new BundleApp(app);
}
bootstrap();
