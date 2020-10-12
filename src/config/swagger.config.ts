import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerCustomOptions
} from "@nestjs/swagger";

export const swaggerConfig = new DocumentBuilder()
  .setTitle("Air Travel API")
  .setDescription("API description")
  .setVersion("1.0")
  .addBearerAuth()
  .build();

export const swaggerDocumentOptions: SwaggerDocumentOptions = {
  deepScanRoutes: true
};

export const swaggerSetupOptions: SwaggerCustomOptions = {
  explorer: true,
  swaggerOptions: {
    docExpansion: false,
    deepLinking: true
  }
};
