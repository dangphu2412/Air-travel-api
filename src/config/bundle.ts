import {TimeoutInterceptor} from "../common/interceptors/timeout.interceptor";
import {INestApplication, Logger, ValidationPipe} from "@nestjs/common";
import {SwaggerModule} from "@nestjs/swagger";
import {swaggerConfig, swaggerDocumentOptions, swaggerSetupOptions} from "./swagger.config";
import {HttpExceptionFilter} from "src/global/httpException.filter";
import {TransformInterceptor} from "src/common/interceptors/transform.interceptor";

export class BundleApp {
  private readonly app: INestApplication;

  private readonly logger: typeof Logger;

  constructor(app: INestApplication) {
    this.app = app;
    this.logger = Logger;
    this.prefixOptionsApp();
    this.setSwagger();
    this.listenApp();
  }

  private prefixOptionsApp() {
    this.app.setGlobalPrefix("v1");
    this.app.useGlobalPipes(new ValidationPipe());
    this.app.useGlobalInterceptors(new TimeoutInterceptor());
    this.app.useGlobalInterceptors(new TransformInterceptor());
    this.app.useGlobalFilters(new HttpExceptionFilter());
  }

  private setSwagger() {
    if (process.env.NODE_ENV !== "production") {

      const document = SwaggerModule.createDocument(
        this.app,
        swaggerConfig,
        swaggerDocumentOptions
      );

      SwaggerModule.setup("docs", this.app, document, swaggerSetupOptions);
    }
  }

  private async listenApp() {
    const port = process.env.PORT || 3000;
    await this.app.listen(port);
    this.logger.debug(`Application listening on port ${port}`);
  }
}
