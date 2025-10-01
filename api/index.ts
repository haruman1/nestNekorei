import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';

import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '@nestjs/common';

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
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Swagger UI pointing ke swagger.json statis
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { url: '/swagger-static/swagger.json' },
  });

  // Serve swagger.json secara manual
  const swaggerDocument = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../src/swagger/swagger.json'),
      'utf8',
    ),
  );
  app.getHttpAdapter().get('/swagger-json', async (req, reply) => {
    return reply.send(swaggerDocument);
  });
  // Ambil ALLOWED_ORIGINS dari .env (misal: http://localhost:3000,https://demo.haruman.me)
  const allowed = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    : ['*']; // default allow all

  // Aktifkan CORS di NestJS (tanpa @fastify/cors register manual)
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
