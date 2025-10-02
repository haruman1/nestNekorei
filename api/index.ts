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
    .setTitle('API Docs')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customfavIcon: 'https://i.postimg.cc/g0kd4qTH/unnamed-2.jpg',
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.29.1/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.29.1/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.29.1/swagger-ui-standalone-preset.min.js',
    ],
  });

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
