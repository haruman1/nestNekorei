import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import fastifyHelmet from '@fastify/helmet';
import fastifyCors from '@fastify/cors';
import * as dotenv from 'dotenv';
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const logger = new Logger('Bootstrap');
  dotenv.config();
  // ✅ Global validation

  // ✅ Helmet + CSP dari ENV
  // await app.register(fastifyHelmet, {
  //   contentSecurityPolicy: {
  //     directives: {
  //       defaultSrc: (process.env.CSP_DEFAULT_SRC || 'self').split(' '),
  //       scriptSrc: (process.env.CSP_SCRIPT_SRC || 'self').split(' '),
  //       styleSrc: (process.env.CSP_STYLE_SRC || 'self').split(' '),
  //       imgSrc: (process.env.CSP_IMG_SRC || '*').split(' '),
  //       fontSrc: (process.env.CSP_FONT_SRC || 'self').split(' '),
  //     },
  //   },
  // });

  // ✅ CORS whitelist pakai ENV
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

  // ✅ Swagger
  const config = new DocumentBuilder()
    .setTitle('Nekorei API')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  // ✅ Start server
  await app.listen(3001, '0.0.0.0');
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}
bootstrap();
