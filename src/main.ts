import {NestFactory} from "@nestjs/core";
import "./config/crud.config";
import {AppModule} from "./app.module";
import {BundleApp} from "./config/bundle";

require("dotenv").config({path: ".env"});

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
