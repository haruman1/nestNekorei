import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { AppModule } from '../src/app.module';

import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '@nestjs/common';
import { resolve } from 'path';
import { writeFileSync } from 'fs';
let server: any;

async function bootstrap(): Promise<NestFastifyApplication> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const logger = new Logger('Bootstrap');
  const config = new DocumentBuilder()
    .setTitle('Nekorei API')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addServer(
      process.env.CHECK_DASAR === 'production'
        ? 'https://demo-1.haruman.me'
        : 'http://localhost:3001',
    )
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  if (process.env.CHECK_DASAR === 'development') {
    const pathToSwaggerStaticFolder = resolve(process.cwd(), 'swagger');

    // write swagger json file
    const pathToSwaggerJson = resolve(
      pathToSwaggerStaticFolder,
      'swagger.json',
    );
    const swaggerJson = JSON.stringify(document, null, 2);
    writeFileSync(pathToSwaggerJson, swaggerJson);
    console.log(`Swagger JSON file written to: '/swagger/swagger.json'`);
  } else {
    SwaggerModule.setup('docs', app, document, {
      jsonDocumentUrl: 'swagger/json',
      customfavIcon: 'https://placecats.com/300/200',
      customCssUrl: 'https://unpkg.com/swagger-ui@5.29.1/dist/swagger-ui.css',
      customCss: '../src/swagger/custom.css',
      customJs: 'https://unpkg.com/swagger-ui@5.29.1/dist/swagger-ui-bundle.js',
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none',
      },
    });
  }

  const allowed = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    : ['*'];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowed.includes(origin) || allowed.includes('*')) {
        callback(null, true); // allow
      } else {
        callback(new Error(`❌ Origin ${origin} not allowed by CORS`), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.init();
  await app.getHttpAdapter().getInstance().ready();
  return app;
}

export default async function handler(req, res) {
  if (!server) {
    const app = await bootstrap();
    const fastify = app.getHttpAdapter().getInstance();
    server = (req, res) => fastify.routing(req, res);
  }
  return server(req, res);
}
