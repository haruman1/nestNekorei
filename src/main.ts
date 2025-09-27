import { NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { resolve } from 'path';
import { writeFileSync } from 'fs';
import serverlessExpress from '@vendia/serverless-express';
import express, { Application } from 'express'; // ⬅️ tambahkan

let server: any;

async function bootstrap(): Promise<Application> {
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
    const pathToSwaggerStaticFolder = resolve(process.cwd(), 'swagger-static');

    const pathToSwaggerJson = resolve(
      pathToSwaggerStaticFolder,
      'swagger.json',
    );
    const swaggerJson = JSON.stringify(document, null, 2);
    writeFileSync(pathToSwaggerJson, swaggerJson);
    console.log(`Swagger JSON file written to: '/swagger-static/swagger.json'`);
  } else {
    SwaggerModule.setup('docs', app, document, {
      jsonDocumentUrl: 'swagger/json',
      customfavIcon: 'https://placecats.com/300/200',
    });
    app.enableCors({
      origin: ['https://demo-1.haruman.me'],
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    });
  }

  app.getHttpAdapter().get('/swagger-json', (req, res) => {
    res.json(document);
  });

  // ❌ jangan listen di Vercel
  await app.init();
  return app.getHttpAdapter().getInstance() as Application; // ⬅️ fix TS
}

export default async function handler(req, res) {
  if (!server) {
    const expressApp = await bootstrap();
    server = serverlessExpress({ app: expressApp });
  }
  return server(req, res);
}
