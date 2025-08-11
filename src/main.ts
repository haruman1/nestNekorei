import { NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);

  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Nekorei API')
    .setDescription('The cats API description')
    .addServer(
      process.env.CHECK_DASAR === 'production'
        ? 'https://demo-1.haruman.me'
        : 'http://localhost:3001',
    )
    .setVersion('1.0')
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  if (process.env.CHECK_DASAR === 'development') {
    app.enableCors();
    SwaggerModule.setup('swagger', app, document, {
      jsonDocumentUrl: 'swagger/json',
      customfavIcon: 'https://placecats.com/300/200',
      customCssUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
      ],
    });
  }
  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'swagger/json',
    customfavIcon: 'https://placecats.com/300/200',
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
  });
  app.enableCors({
    origin: ['https://demo-1.haruman.me', 'https://demo-1.haruman.me'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  });

  // app.enableCors({
  //   origin: ['https://cosparade.xyz', 'http://cosparade.xyz'],
  //   methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  // });

  await app.listen(process.env.PORT_SERVER);
}
bootstrap();
