import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import fastifyCors from '@fastify/cors';
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

  app.enableCors();

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
  await app.register(fastifyCors, {
    origin: (origin, cb) => {
      const allowed = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
        : [];

      if (!origin || allowed.includes(origin)) {
        cb(null, true);
      } else {
        logger.warn(`🚨 Blocked request from unauthorized origin: ${origin}`);
        cb(new Error('Not allowed by CORS'), false);
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
